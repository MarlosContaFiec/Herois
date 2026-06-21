import prisma from '../utils/prisma.js';

export const encontrarBossHoje = (guildaId, inicio, fim) =>
  prisma.bossGuilda.findFirst({
    where: { guildaId, dataAtribuida: { gte: inicio, lt: fim } },
    include: { ataques: { include: { usuario: { select: { id: true, nomeUsuario: true } } } } },
  });

export const criarBoss = (data) =>
  prisma.bossGuilda.create({ data });

export const atualizarBoss = (id, data) =>
  prisma.bossGuilda.update({ where: { id }, data, include: { ataques: true } });

export const criarAtaque = (data) =>
  prisma.ataqueBossGuilda.create({ data, include: { usuario: { select: { id: true, nomeUsuario: true } } } });

export const encontrarUltimoBossDerrotado = (guildaId) =>
  prisma.bossGuilda.findFirst({
    where: { guildaId, hpAtual: 0 },
    orderBy: { dataAtribuida: 'desc' },
  });

export const encontrarBossAnterior = (guildaId, dataAtual) =>
  prisma.bossGuilda.findFirst({
    where: { guildaId, dataAtribuida: { lt: dataAtual } },
    orderBy: { dataAtribuida: 'desc' },
  });

export const encontrarMembrosGuilda = (guildaId) =>
  prisma.membroGuilda.findMany({
    where: { guildaId },
    include: {
      usuario: {
        include: {
          cartas: { include: { carta: true }, orderBy: { carta: { poder: 'desc' } } },
        },
      },
    },
  });