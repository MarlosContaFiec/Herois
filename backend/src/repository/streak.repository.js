import prisma from "../utils/prisma.js";

export const encontrarUsuario = (id) =>
  prisma.usuario.findUnique({ where: { id } });

export const atualizar = (id, data) =>
  prisma.usuario.update({ where: { id }, data });

export const encontrarCartaAleatoriaPorRaridade = async (raridade) => {
  const cartas = await prisma.carta.findMany({ where: { raridade } });
  if (cartas.length === 0) return null;
  return cartas[Math.floor(Math.random() * cartas.length)];
};

export const criarCartaUsuario = (data) =>
  prisma.cartaUsuario.create({ data, include: { carta: true } });

export const encontrarCartaUsuario = (usuarioId, cartaId) =>
  prisma.cartaUsuario.findUnique({
    where: { usuarioId_cartaId: { usuarioId, cartaId } },
  });

export const atualizarCartaUsuario = (id, data) =>
  prisma.cartaUsuario.update({ where: { id }, data, include: { carta: true } });

export const encontrarUserPacks = () =>
  prisma.pacote.findMany({
    where: { secreto: false, unico: false },
    orderBy: { custo: "asc" },
  });

export const criarPacoteUsuario = (data) =>
  prisma.pacoteUsuario.create({ data });
