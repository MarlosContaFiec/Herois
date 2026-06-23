import prisma from "../utils/prisma.js";

export const encontrarPorId = (id) =>
  prisma.usuario.findUnique({ where: { id } });

export const encontrarPorEmail = (email) =>
  prisma.usuario.findUnique({ where: { email } });

export const encontrarPorNome = (nomeUsuario) =>
  prisma.usuario.findUnique({ where: { nomeUsuario } });

export const criar = (dados) =>
  prisma.usuario.create({ data: dados });

export const atualizar = (id, data) =>
  prisma.usuario.update({
    where: { id },
    data,
    select: { id: true, nomeUsuario: true, email: true },
  });
