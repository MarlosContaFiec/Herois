import * as missaoDiariaRepo from '../repository/missaoDiaria.repository.js';
import * as pacoteRepo from '../repository/pacote.repository.js';
import { multiplicadorElemental } from '../utils/constantes.js';

const ELEMENTOS = ['FOGO', 'AGUA', 'TERRA', 'VENTO', 'LUZ', 'TREVAS'];

const INIMIGOS = {
  FOGO:   'Fênix das Chamas',
  AGUA:   'Kraken Profundo',
  TERRA:  'Golem Ancestral',
  VENTO:  'Dragão Celeste',
  LUZ:    'Seráfico Guardião',
  TREVAS: 'Lorde das Sombras',
};

const XP_DUPLICATA = { COMUM: 5, INCOMUM: 15, RARA: 40, EPICA: 100, LENDARIA: 250 };

function obterElementoDoDia(usuarioId) {
  const hoje = new Date().toISOString().split('T')[0];
  let hash = 0;
  const str = usuarioId + hoje;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return ELEMENTOS[Math.abs(hash) % ELEMENTOS.length];
}

function obterPacoteDoDia() {
  const hoje = new Date();
  const inicioAno = new Date(hoje.getFullYear(), 0, 0);
  const diaDoAno = Math.floor((hoje - inicioAno) / (1000 * 60 * 60 * 24));
  return diaDoAno;
}

function calcularMelhoresCartas(cartas) {
  return cartas.slice(0, 3);
}

function calcularPoderEfetivo(cartas, elementoInimigo) {
  return cartas.reduce((total, cu) => {
    const mult = multiplicadorElemental(cu.carta.elemento, elementoInimigo);
    return total + (cu.carta.poder * mult);
  }, 0);
}

function calcularChance(poderJogador, poderInimigo) {
  const ratio = poderJogador / poderInimigo;
  if (ratio >= 1.2) return 100;
  if (ratio >= 1.0) return Math.min(100, 70 + (ratio - 1.0) * 100);
  if (ratio >= 0.5) return 30 + (ratio - 0.5) * 80;
  return Math.max(5, ratio * 60);
}

export async function obterStatus(usuarioId) {
  const usuario = await missaoDiariaRepo.encontrarUsuario(usuarioId);
  if (!usuario) throw new Error('Usuário não encontrado');

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const jaTentou = await missaoDiariaRepo.encontrarTentativaHoje(usuarioId, hoje, amanha);

  const elemento = obterElementoDoDia(usuarioId);

  const melhores = calcularMelhoresCartas(usuario.cartas);
  const somaPoder = melhores.reduce((s, c) => s + c.carta.poder, 0);
  const media = melhores.length > 0 ? somaPoder / melhores.length : 50;
  const poderInimigo = Math.floor(media * 1.5);

  const pacotes = await pacoteRepo.listarTodos();
  const pacoteDoDia = pacotes[obterPacoteDoDia() % pacotes.length];

  return {
    nomeInimigo: INIMIGOS[elemento],
    elemento,
    poderInimigo,
    pacoteRecompensa: pacoteDoDia ? { id: pacoteDoDia.id, nome: pacoteDoDia.nome } : null,
    jaTentou: !!jaTentou,
    tentativa: jaTentou || null,
  };
}

export async function enfrentar(usuarioId, cartasUsuarioIds) {
  const usuario = await missaoDiariaRepo.encontrarUsuario(usuarioId);
  if (!usuario) throw new Error('Usuário não encontrado');

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const jaTentou = await missaoDiariaRepo.encontrarTentativaHoje(usuarioId, hoje, amanha);
  if (jaTentou) throw new Error('Você já tentou a missão diária hoje');

  const cartas = [];
  for (const id of cartasUsuarioIds) {
    const cu = await missaoDiariaRepo.encontrarCartaUsuario(id);
    if (!cu) throw new Error(`Carta ${id} não encontrada`);
    if (cu.usuarioId !== usuarioId) throw new Error(`Carta ${id} não pertence a você`);
    cartas.push(cu);
  }

  const elemento = obterElementoDoDia(usuarioId);
  const nomeInimigo = INIMIGOS[elemento];

  const melhores = calcularMelhoresCartas(usuario.cartas);
  const media = melhores.length > 0 ? melhores.reduce((s, c) => s + c.carta.poder, 0) / melhores.length : 50;
  const poderInimigo = Math.floor(media * 1.5);

  const poderJogador = calcularPoderEfetivo(cartas, elemento);
  const chance = calcularChance(poderJogador, poderInimigo);
  const rolagem = Math.random() * 100;
  const venceu = rolagem <= chance;

  let recompensas = null;

  if (venceu) {
    const moedas = Math.floor(poderInimigo * 0.5);
    const bonusMoedasTitulo = usuario.tituloAtivo?.tipoBonus === 'MOEDAS' ? usuario.tituloAtivo.valorBonus : 0;
    const moedasFinal = Math.floor(moedas * (1 + bonusMoedasTitulo));

    const xpGanho = Math.floor(poderInimigo * 0.3);

    await missaoDiariaRepo.atualizarUsuario(usuarioId, {
      moedas: usuario.moedas + moedasFinal,
      experiencia: usuario.experiencia + xpGanho,
    });

    for (const cu of cartas) {
      const xpCarta = Math.floor(xpGanho * 0.5);
      await missaoDiariaRepo.atualizarCartaUsuario(cu.id, { xp: cu.xp + xpCarta });
    }

    const pacotes = await pacoteRepo.listarTodos();
    const pacoteDoDia = pacotes[obterPacoteDoDia() % pacotes.length];

    recompensas = {
      moedas: moedasFinal,
      experiencia: xpGanho,
      pacote: pacoteDoDia ? { id: pacoteDoDia.id, nome: pacoteDoDia.nome } : null,
    };
  }

  await missaoDiariaRepo.criarTentativa({
    usuarioId,
    dataMissao: new Date(),
    cartasUsadas: JSON.stringify(cartas.map((cu) => ({ cartaUsuarioId: cu.id, poder: cu.carta.poder }))),
    resultado: venceu ? 'VITORIA' : 'DERROTA',
    recompensas: recompensas ? JSON.stringify(recompensas) : null,
  });

  return {
    resultado: venceu ? 'VITORIA' : 'DERROTA',
    nomeInimigo,
    elemento,
    poderInimigo,
    poderJogador: Math.floor(poderJogador),
    chance: Math.round(chance * 100) / 100,
    recompensas,
  };
}