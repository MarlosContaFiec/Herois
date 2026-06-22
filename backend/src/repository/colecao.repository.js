import prisma from "../utils/prisma.js";

export const encontrarCartaUsuario = (usuarioId, cartaId) =>
  prisma.cartaUsuario.findUnique({
    where: { usuarioId_cartaId: { usuarioId, cartaId } },
    include: { carta: true },
  });

export const listarColecao = (usuarioId) =>
  prisma.cartaUsuario.findMany({
    where: { usuarioId },
    include: { carta: true },
    orderBy: { adquiridoEm: "desc" },
  });

export const adicionarCarta = (usuarioId, cartaId) =>
  prisma.cartaUsuario.create({
    data: { usuarioId, cartaId },
    include: { carta: true },
  });

export const removerCarta = (usuarioId, cartaId) =>
  prisma.cartaUsuario.delete({
    where: { usuarioId_cartaId: { usuarioId, cartaId } },
  });

export const contarPorUsuario = (usuarioId) =>
  prisma.cartaUsuario.count({ where: { usuarioId } });
