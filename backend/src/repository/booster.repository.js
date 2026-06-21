import prisma from '../utils/prisma.js';

export const listarTodos = () =>
  prisma.booster.findMany({
    include: { criador: { select: { id: true, nomeUsuario: true } } },
    orderBy: { criadoEm: 'desc' },
  });

export const encontrarPorId = (id) =>
  prisma.booster.findUnique({
    where: { id },
    include: { criador: { select: { id: true, nomeUsuario: true } } },
  });

export const criar = (data) =>
  prisma.booster.create({
    data,
    include: { criador: { select: { id: true, nomeUsuario: true } } },
  });