import * as bossRepo from "../repository/bossGuilda.repository.js";
import * as guildaRepo from "../repository/guilda.repository.js";
import { multiplicadorElemental } from "../utils/constantes.js";

const ELEMENTOS_ARRAY = ["FOGO", "AGUA", "TERRA", "VENTO", "LUZ", "TREVAS"];

const RANKING_BONUS = {
  1: 2.5,
  2: 2.0,
  3: 1.75,
  4: 1.4,
  5: 1.2,
};

function obterInicioFimHoje() {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + 1);
  return { inicio, fim };
}

function obterElementoAleatorio(elementoAnterior) {
  const disponiveis = ELEMENTOS_ARRAY.filter((e) => e !== elementoAnterior);
  return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}

function calcularPoderBase(membros) {
  if (membros.length === 0) return 1000;

  let somaTotal = 0;
  let count = 0;

  for (const membro of membros) {
    const cartas = membro.usuario.cartas || [];
    const top3 = cartas.slice(0, 3);
    const media =
      top3.length > 0
        ? top3.reduce((s, c) => s + c.carta.poder, 0) / top3.length
        : 0;
    somaTotal += media;
    count++;
  }

  const mediaGuilda = count > 0 ? somaTotal / count : 50;
  const multiplicador = 1 + mediaGuilda / 500;
  return Math.floor(1000 * multiplicador);
}

export async function obterStatus(usuarioId) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro) throw new Error("Você não pertence a uma guilda");

  const { inicio, fim } = obterInicioFimHoje();
  let boss = await bossRepo.encontrarBossHoje(membro.guildaId, inicio, fim);

  if (!boss) {
    const bossAnterior = await bossRepo.encontrarBossAnterior(
      membro.guildaId,
      inicio,
    );
    const elementoAnterior = bossAnterior?.elemento || null;
    const elemento = obterElementoAleatorio(elementoAnterior);

    const membros = await bossRepo.encontrarMembrosGuilda(membro.guildaId);
    const poderBase = calcularPoderBase(membros);

    boss = await bossRepo.criarBoss({
      guildaId: membro.guildaId,
      elemento,
      nivel: 0,
      hpAtual: poderBase,
      hpMaximo: poderBase,
      poderBase,
      dataAtribuida: inicio,
    });
  }

  const meusAtaques = boss.ataques.filter((a) => a.usuarioId === usuarioId);
  const perdi = meusAtaques.some((a) => !a.derrotou);

  const ranking = {};
  for (const ataque of boss.ataques) {
    if (
      !ranking[ataque.usuarioId] ||
      ataque.poderUsado > ranking[ataque.usuarioId].poder
    ) {
      ranking[ataque.usuarioId] = {
        usuario: ataque.usuario,
        poder: ataque.poderUsado,
      };
    }
  }
  const top5 = Object.values(ranking)
    .sort((a, b) => b.poder - a.poder)
    .slice(0, 5);

  const agora = new Date();
  const resetEm = new Date(inicio);
  resetEm.setHours(21, 0, 0, 0);
  if (agora >= resetEm) {
    resetEm.setDate(resetEm.getDate() + 1);
  }

  return {
    boss: {
      id: boss.id,
      elemento: boss.elemento,
      nivel: boss.nivel,
      hpAtual: boss.hpAtual,
      hpMaximo: boss.hpMaximo,
      poderBase: boss.poderBase,
    },
    possoAtacar: !perdi,
    meusAtaques: meusAtaques.length,
    ranking: top5.map((r, i) => ({
      posicao: i + 1,
      usuario: r.usuario.nomeUsuario,
      poder: r.poder,
    })),
    totalAtaques: boss.ataques.length,
    resetEm: resetEm.toISOString(),
  };
}

export async function atacar(usuarioId, cartasUsuarioIds) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro) throw new Error("Você não pertence a uma guilda");

  const { inicio, fim } = obterInicioFimHoje();
  const boss = await bossRepo.encontrarBossHoje(membro.guildaId, inicio, fim);
  if (!boss) throw new Error("Boss não encontrado para hoje");

  const meusAtaques = boss.ataques.filter((a) => a.usuarioId === usuarioId);
  const perdi = meusAtaques.some((a) => !a.derrotou);
  if (perdi) throw new Error("Você já perdeu para o boss hoje");

  const prisma = (await import("../utils/prisma.js")).default;
  const cartas = [];
  for (const id of cartasUsuarioIds) {
    const cu = await prisma.cartaUsuario.findUnique({
      where: { id },
      include: { carta: true },
    });
    if (!cu) throw new Error(`Carta ${id} não encontrada`);
    if (cu.usuarioId !== usuarioId)
      throw new Error(`Carta ${id} não pertence a você`);
    cartas.push(cu);
  }

  const poderJogador = cartas.reduce((total, cu) => {
    const mult = multiplicadorElemental(cu.carta.elemento, boss.elemento);
    return total + cu.carta.poder * mult;
  }, 0);

  let danoCausado;
  let derrotou = false;

  if (poderJogador >= boss.hpAtual) {
    danoCausado = boss.hpAtual;
    derrotou = true;
  } else {
    danoCausado = Math.floor(poderJogador * 0.5);
  }

  const novoHp = Math.max(0, boss.hpAtual - danoCausado);

  await bossRepo.criarAtaque({
    bossId: boss.id,
    usuarioId,
    cartasUsadas: JSON.stringify(
      cartas.map((cu) => ({ cartaUsuarioId: cu.id, poder: cu.carta.poder })),
    ),
    poderUsado: Math.floor(poderJogador),
    danoCausado,
    derrotou,
  });

  if (derrotou) {
    const novoNivel = boss.nivel + 1;
    const novoPoder = Math.floor(boss.poderBase * Math.pow(1.5, novoNivel));

    await bossRepo.atualizarBoss(boss.id, {
      nivel: novoNivel,
      hpAtual: novoPoder,
      hpMaximo: novoPoder,
    });
  } else {
    await bossRepo.atualizarBoss(boss.id, { hpAtual: novoHp });
  }

  return {
    poderJogador: Math.floor(poderJogador),
    poderBoss: boss.hpAtual,
    danoCausado,
    derrotou,
    hpRestante: novoHp,
  };
}

export async function distribuirRecompensas(guildaId) {
  const { inicio, fim } = obterInicioFimHoje();

  const boss = await bossRepo.encontrarBossHoje(guildaId, inicio, fim);
  if (!boss) throw new Error("Nenhum boss encontrado para hoje");
  if (boss.ataques.length === 0) throw new Error("Nenhum ataque registrado");

  const ranking = {};
  for (const ataque of boss.ataques) {
    if (
      !ranking[ataque.usuarioId] ||
      ataque.poderUsado > ranking[ataque.usuarioId].poder
    ) {
      ranking[ataque.usuarioId] = {
        usuarioId: ataque.usuarioId,
        usuario: ataque.usuario,
        poder: ataque.poderUsado,
      };
    }
  }

  const top5 = Object.values(ranking)
    .sort((a, b) => b.poder - a.poder)
    .slice(0, 5);
  const todosParticipantes = Object.values(ranking);

  const recompensaBase = 100 + boss.nivel * 50;
  const prisma = (await import("../utils/prisma.js")).default;

  const recompensas = [];

  for (const participante of todosParticipantes) {
    const posicaoTop = top5.findIndex(
      (t) => t.usuarioId === participante.usuarioId,
    );
    const multiplicador = posicaoTop >= 0 ? RANKING_BONUS[posicaoTop + 1] : 1.0;
    const moedas = Math.floor(recompensaBase * multiplicador);

    const usuario = await prisma.usuario.findUnique({
      where: { id: participante.usuarioId },
    });
    await prisma.usuario.update({
      where: { id: participante.usuarioId },
      data: { moedas: usuario.moedas + moedas },
    });

    recompensas.push({
      usuario: participante.usuario.nomeUsuario,
      posicao: posicaoTop >= 0 ? posicaoTop + 1 : "-",
      multiplicador,
      moedas,
    });
  }

  await prisma.ataqueBossGuilda.deleteMany({ where: { bossId: boss.id } });
  await prisma.bossGuilda.delete({ where: { id: boss.id } });

  return { recompensaBase, recompensas };
}
