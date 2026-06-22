import * as missaoRepo from "../repository/missao.repository.js";
import { atualizarEstatisticas } from "./rankingSemanal.service.js";
import { multiplicadorElemental } from "../utils/constantes.js";

const TRINCO_CLASSE = {
  GUERREIRO: { poder: 1.15, moedas: 1.0, tempo: 1.0, drop: 0 },
  MAGO: { poder: 1.0, moedas: 2.0, tempo: 1.0, drop: 0 },
  PATRULHEIRO: { poder: 1.0, moedas: 1.0, tempo: 0.8, drop: 0 },
  CURANDEIRO: { poder: 1.0, moedas: 1.0, tempo: 1.0, drop: 0.25 },
  LADINO: { poder: 1.0, moedas: 1.5, tempo: 0.9, drop: 0 },
};

function calcularPoderEfetivo(cartas, elementoInimigo) {
  return cartas.reduce((total, cu) => {
    const multiplicador = multiplicadorElemental(
      cu.carta.elemento,
      elementoInimigo,
    );
    return total + cu.carta.poder * multiplicador;
  }, 0);
}

function detectarTrinco(cartas) {
  if (cartas.length < 3) return null;
  const classes = cartas.map((cu) => cu.carta.classe);
  if (classes.every((c) => c === classes[0])) return classes[0];
  return null;
}

function calcularChance(poderEfetivo, poderInimigo) {
  const ratio = poderEfetivo / poderInimigo;
  if (ratio >= 1.2) return 100;
  if (ratio >= 1.0) return Math.min(100, 70 + (ratio - 1.0) * 100);
  if (ratio >= 0.5) return 30 + (ratio - 0.5) * 80;
  return Math.max(5, ratio * 60);
}

function calcularTempo(tempoBase, ratio, trinco, tituloTempo) {
  let tempo = ratio >= 1.0 ? tempoBase * 0.5 : tempoBase * (2 - ratio);
  if (trinco) {
    const bonus = TRINCO_CLASSE[trinco];
    if (bonus.tempo < 1.0) tempo *= bonus.tempo;
  }
  if (tituloTempo) tempo *= 1 - tituloTempo;
  return Math.max(1, Math.ceil(tempo));
}

export async function listar(elemento) {
  return missaoRepo.listarTodas(elemento);
}

export async function encontrarPorId(id) {
  const missao = await missaoRepo.encontrarPorId(id);
  if (!missao) throw new Error("Missao nao encontrada");
  return missao;
}

export async function tentativaPendente(usuarioId) {
  return missaoRepo.encontrarTentativaPendente(usuarioId);
}

export async function iniciar(usuarioId, missaoId, cartasUsuarioIds) {
  const pendente = await missaoRepo.encontrarTentativaPendente(usuarioId);
  if (pendente) throw new Error("Voce ja tem uma batalha em andamento");

  const usuario = await missaoRepo.encontrarUsuario(usuarioId);
  if (!usuario) throw new Error("Usuario nao encontrado");

  const missao = await missaoRepo.encontrarPorId(missaoId);
  if (!missao) throw new Error("Missao nao encontrada");

  const cartas = [];
  for (const id of cartasUsuarioIds) {
    const cu = await missaoRepo.encontrarCartaUsuario(id);
    if (!cu) throw new Error(`Carta de usuario ${id} nao encontrada`);
    if (cu.usuarioId !== usuarioId)
      throw new Error(`Carta ${id} nao pertence a voce`);
    cartas.push(cu);
  }

  const poderEfetivo = calcularPoderEfetivo(cartas, missao.elemento);
  const trinco = detectarTrinco(cartas);
  let poderFinal = poderEfetivo;
  let multiplicadorMoedas = 1.0;
  let bonusDrop = 0;

  if (trinco) {
    const bonus = TRINCO_CLASSE[trinco];
    poderFinal *= bonus.poder;
    multiplicadorMoedas *= bonus.moedas;
    bonusDrop = bonus.drop;
  }

  const ratio = poderFinal / missao.poderInimigo;
  const chance = calcularChance(poderFinal, missao.poderInimigo);
  const tempo = calcularTempo(
    missao.tempoMinutos,
    ratio,
    trinco,
    usuario.tituloAtivo?.tipoBonus === "TEMPO"
      ? usuario.tituloAtivo.valorBonus
      : null,
  );

  const agora = new Date();
  const completaEm = new Date(agora.getTime() + tempo * 60 * 1000);

  const dadosBatalha = JSON.stringify({
    cartas: cartas.map((cu) => ({
      cartaUsuarioId: cu.id,
      poder: cu.carta.poder,
      elemento: cu.carta.elemento,
      classe: cu.carta.classe,
      nome: cu.carta.nome,
    })),
    poderEfetivo: Math.floor(poderEfetivo),
    poderFinal: Math.floor(poderFinal),
    trinco,
    multiplicadorMoedas,
    bonusDrop,
    ratio: Math.round(ratio * 100) / 100,
    chance: Math.round(chance * 100) / 100,
    multiplicadorMoedasTitulo:
      usuario.tituloAtivo?.tipoBonus === "MOEDAS"
        ? usuario.tituloAtivo.valorBonus
        : 0,
  });

  const tentativa = await missaoRepo.criarTentativa({
    usuarioId,
    missaoId,
    cartasUsadas: dadosBatalha,
    trioClasse: !!trinco,
    resultado: "EM_ANDAMENTO",
    moedasGanhas: 0,
    expGanha: 0,
    tempoGasto: tempo,
    completadoEm: completaEm,
  });

  return {
    tentativaId: tentativa.id,
    tempo,
    tempoSegundos: tempo * 60,
    completaEm: completaEm.toISOString(),
    missao: {
      id: missao.id,
      nome: missao.nome,
      nomeInimigo: missao.nomeInimigo,
      poderInimigo: missao.poderInimigo,
      elemento: missao.elemento,
    },
    poderJogador: Math.floor(poderFinal),
    chance: Math.round(chance * 100) / 100,
    trinco: trinco || null,
    cartasSelecionadas: cartas.map((cu) => ({
      id: cu.id,
      nome: cu.carta.nome,
      poder: cu.carta.poder,
      elemento: cu.carta.elemento,
      classe: cu.carta.classe,
      raridade: cu.carta.raridade,
    })),
  };
}

export async function resolver(usuarioId, tentativaId) {
  const tentativa = await missaoRepo.encontrarTentativaPorId(tentativaId);
  if (!tentativa) throw new Error("Tentativa nao encontrada");
  if (tentativa.usuarioId !== usuarioId)
    throw new Error("Esta tentativa nao e sua");
  if (tentativa.resultado !== "EM_ANDAMENTO")
    throw new Error("Esta batalha ja foi resolvida");

  const agora = new Date();
  if (agora < tentativa.completadoEm) {
    const restanteMs = tentativa.completadoEm - agora;
    const restanteSeg = Math.ceil(restanteMs / 1000);
    return {
      status: "EM_ANDAMENTO",
      tempoRestante: restanteSeg,
      completaEm: tentativa.completadoEm.toISOString(),
    };
  }

  const dados = JSON.parse(tentativa.cartasUsadas);
  const missao = await missaoRepo.encontrarPorId(tentativa.missaoId);
  const usuario = await missaoRepo.encontrarUsuario(usuarioId);

  const chance = dados.chance;
  const rolagem = Math.random() * 100;
  const venceu = rolagem <= chance;

  let moedasGanhas = 0;
  let expGanha = 0;

  if (venceu) {
    moedasGanhas = Math.floor(
      missao.recompensaMoedas *
        dados.multiplicadorMoedas *
        (1 + (dados.multiplicadorMoedasTitulo || 0)),
    );
    expGanha = missao.recompensaExp;

    const novoExp = usuario.experiencia + expGanha;
    const expParaSubir = usuario.nivel * 100;
    let novoNivel = usuario.nivel;
    let expFinal = novoExp;

    if (novoExp >= expParaSubir) {
      novoNivel += 1;
      expFinal = novoExp - expParaSubir;
    }

    await missaoRepo.atualizarUsuario(usuarioId, {
      moedas: usuario.moedas + moedasGanhas,
      experiencia: expFinal,
      nivel: novoNivel,
    });

    await atualizarEstatisticas(usuarioId, "MISSAO_COMPLETA");

    const xpCartas = Math.floor(missao.recompensaExp * 0.5);
    for (const c of dados.cartas) {
      const cu = await missaoRepo.encontrarCartaUsuario(c.cartaUsuarioId);
      if (cu) {
        await missaoRepo.atualizarCartaUsuario(cu.id, { xp: cu.xp + xpCartas });
      }
    }
  }

  let recompensaEspecial = null;
  if (venceu && dados.bonusDrop > 0 && Math.random() < dados.bonusDrop) {
    recompensaEspecial = {
      tipo: "DROP_ESPECIAL",
      mensagem: "Recompensa especial obtida!",
    };
  }

  await missaoRepo.atualizarTentativa(tentativaId, {
    resultado: venceu ? "VITORIA" : "DERROTA",
    moedasGanhas,
    expGanha,
    completadoEm: new Date(),
  });

  return {
    status: "CONCLUIDO",
    resultado: venceu ? "VITORIA" : "DERROTA",
    poderJogador: dados.poderFinal,
    poderInimigo: missao.poderInimigo,
    chance,
    trinco: dados.trinco,
    moedasGanhas,
    expGanha,
    recompensaEspecial,
  };
}
