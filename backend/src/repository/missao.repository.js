import prisma from '../utils/prisma.js';

export const listarTodas = (elemento) => {
  const where = {};
  if (elemento) where.elemento = elemento;
  return prisma.missao.findMany({ where, orderBy: { poderInimigo: 'asc' } });
};

export const encontrarPorId = (id) =>
  prisma.missao.findUnique({ where: { id } });

export const encontrarCartaUsuario = (id) =>
  prisma.cartaUsuario.findUnique({
    where: { id },
    include: { carta: true },
  });

export const criarTentativa = (data) =>
  prisma.tentativaMissao.create({ data });

export const atualizarUsuario = (id, data) =>
  prisma.usuario.update({ where: { id }, data });

export const encontrarUsuario = (id) =>
  prisma.usuario.findUnique({ where: { id }, include: { tituloAtivo: true } });

export const atualizarCartaUsuario = (id, data) =>
  prisma.cartaUsuario.update({ where: { id }, data });