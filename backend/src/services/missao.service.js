import * as missaoRepo from '../repository/missao.repository.js';
import * as usuarioRepo from '../repository/usuario.repository.js';
import {
  multiplicadorElemental,
  FAIXA_PODER,
  ORDEM_RARIDADE,
} from '../utils/constantes.js';

const TRINCO_CLASSE = {
  GUERREIRO:   { poder: 1.15, moedas: 1.0, tempo: 1.0,  drop: 0 },
  MAGO:        { poder: 1.0,  moedas: 2.0, tempo: 1.0,  drop: 0 },
  PATRULHEIRO: { poder: 1.0,  moedas: 1.0, tempo: 0.80, drop: 0 },
  CURANDEIRO:  { poder: 1.0,  moedas: 1.0, tempo: 1.0,  drop: 0.25 },
  LADINO:      { poder: 1.0,  moedas: 1.5, tempo: 0.90, drop: 0 },
};

function calcularPoderEfetivo(cartas, elementoInimigo) {
  return cartas.reduce((total, cu) => {
    const multiplicador = multiplicadorElemental(cu.carta.elemento, elementoInimigo);
    return total + (cu.carta.poder * multiplicador);
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

  const temVantagem = poderEfetivo >= poderInimigo;
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
  if (tituloTempo) tempo *= (1 - tituloTempo);
  return Math.max(1, Math.ceil(tempo));
}

export async function listar(elemento) {
  return missaoRepo.listarTodas(elemento);
}

export async function encontrarPorId(id) {
  const missao = await missaoRepo.encontrarPorId(id);
  if (!missao) throw new Error('Missão não encontrada');
  return missao;
}

export async function enfrentar(usuarioId, missaoId, cartasUsuarioIds) {
  const usuario = await missaoRepo.encontrarUsuario(usuarioId);
  if (!usuario) throw new Error('Usuário não encontrado');

  const missao = await missaoRepo.encontrarPorId(missaoId);
  if (!missao) throw new Error('Missão não encontrada');

  const cartas = [];
  for (const id of cartasUsuarioIds) {
    const cu = await missaoRepo.encontrarCartaUsuario(id);
    if (!cu) throw new Error(`Carta de usuário ${id} não encontrada`);
    if (cu.usuarioId !== usuarioId) throw new Error(`Carta ${id} não pertence a você`);
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
  const rolagem = Math.random() * 100;
  const venceu = rolagem <= chance;

  let moedasGanhas = 0;
  let expGanha = 0;

  if (venceu) {
    const bonusMoedasTitulo = usuario.tituloAtivo?.tipoBonus === 'MOEDAS' ? usuario.tituloAtivo.valorBonus : 0;
    moedasGanhas = Math.floor(missao.recompensaMoedas * multiplicadorMoedas * (1 + bonusMoedasTitulo));
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
  }

  const tempo = calcularTempo(
    missao.tempoMinutos,
    ratio,
    trinco,
    usuario.tituloAtivo?.tipoBonus === 'TEMPO' ? usuario.tituloAtivo.valorBonus : null
  );

  let recompensaEspecial = null;
  if (venceu && bonusDrop > 0 && Math.random() < bonusDrop) {
    recompensaEspecial = { tipo: 'DROP_ESPECIAL', mensagem: 'Recompensa especial obtida!' };
  }

  let xpCartas = 0;
  if (venceu) {
    xpCartas = Math.floor(missao.recompensaExp * 0.5);
    for (const cu of cartas) {
      const novoXp = cu.xp + xpCartas;
      await missaoRepo.atualizarCartaUsuario(cu.id, { xp: novoXp });
    }
  }

  const tentativa = await missaoRepo.criarTentativa({
    usuarioId,
    missaoId,
    cartasUsadas: JSON.stringify(cartas.map((cu) => ({ cartaUsuarioId: cu.id, poder: cu.carta.poder }))),
    trioClasse: !!trinco,
    resultado: venceu ? 'VITORIA' : 'DERROTA',
    moedasGanhas,
    expGanha,
    tempoGasto: tempo,
    completadoEm: new Date(),
  });

  return {
    resultado: venceu ? 'VITORIA' : 'DERROTA',
    poderJogador: Math.floor(poderFinal),
    poderInimigo: missao.poderInimigo,
    ratio: Math.round(ratio * 100) / 100,
    chance: Math.round(chance * 100) / 100,
    trinco: trinco || null,
    tempo,
    moedasGanhas,
    expGanha,
    xpCartas,
    recompensaEspecial,
  };
}