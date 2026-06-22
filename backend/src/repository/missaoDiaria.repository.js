import prisma from "../utils/prisma.js";

export const encontrarTentativaHoje = (usuarioId, inicio, fim) =>
  prisma.tentativaDiaria.findFirst({
    where: {
      usuarioId,
      dataMissao: { gte: inicio, lt: fim },
    },
  });

export const criarTentativa = (data) => prisma.tentativaDiaria.create({ data });

export const encontrarUsuario = (id) =>
  prisma.usuario.findUnique({
    where: { id },
    include: {
      tituloAtivo: true,
      cartas: {
        include: { carta: true },
        orderBy: { carta: { poder: "desc" } },
      },
    },
  });

export const encontrarCartaUsuario = (id) =>
  prisma.cartaUsuario.findUnique({
    where: { id },
    include: { carta: true },
  });

export const atualizarUsuario = (id, data) =>
  prisma.usuario.update({ where: { id }, data });

export const atualizarCartaUsuario = (id, data) =>
  prisma.cartaUsuario.update({ where: { id }, data });
