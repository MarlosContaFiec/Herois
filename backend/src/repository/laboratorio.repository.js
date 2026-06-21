import prisma from '../utils/prisma.js';

export const listarPorUsuario = (usuarioId) =>
  prisma.cartaLaboratorio.findMany({
    where: { usuarioId },
    orderBy: { criadoEm: 'desc' },
  });

export const encontrarPorId = (id) =>
  prisma.cartaLaboratorio.findUnique({ where: { id } });

export const criar = (data) =>
  prisma.cartaLaboratorio.create({ data });

export const deletar = (id) =>
  prisma.cartaLaboratorio.delete({ where: { id } });