import prisma from '../utils/prisma.js';

export const listarTodos = () =>
  prisma.titulo.findMany({ orderBy: { valorBonus: 'asc' } });

export const encontrarPorId = (id) =>
  prisma.titulo.findUnique({ where: { id } });

export const listarDoUsuario = (usuarioId) =>
  prisma.tituloUsuario.findMany({
    where: { usuarioId },
    include: { titulo: true },
    orderBy: { adquiridoEm: 'desc' },
  });

export const usuarioTemTitulo = (usuarioId, tituloId) =>
  prisma.tituloUsuario.findUnique({
    where: { usuarioId_tituloId: { usuarioId, tituloId } },
  });

export const concederTitulo = (data) =>
  prisma.tituloUsuario.create({ data });