import prisma from "../utils/prisma.js";

export const encontrarCartaUsuario = (id) =>
  prisma.cartaUsuario.findUnique({
    where: { id },
    include: { carta: true },
  });

export const atualizar = (id, data) =>
  prisma.cartaUsuario.update({ where: { id }, data, include: { carta: true } });

export const atualizarUsuario = (id, data) =>
  prisma.usuario.update({ where: { id }, data });
