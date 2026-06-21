import prisma from '../utils/prisma.js';

export const encontrarPorEmail = (email) =>
  prisma.usuario.findUnique({ where: { email } });

export const encontrarPorNomeUsuario = (nomeUsuario) =>
  prisma.usuario.findUnique({ where: { nomeUsuario } });

export const encontrarPorId = (id) =>
  prisma.usuario.findUnique({ where: { id } });

export const criar = (data) =>
  prisma.usuario.create({ data });

export const atualizar = (id, data) =>
  prisma.usuario.update({ where: { id }, data });