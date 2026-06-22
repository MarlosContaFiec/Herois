import prisma from "../utils/prisma.js";

export const listarTodos = () =>
  prisma.pacote.findMany({ orderBy: { custo: "asc" } });

export const encontrarPorId = (id) =>
  prisma.pacote.findUnique({ where: { id } });

export const contarAberturas = (usuarioId, pacoteId) =>
  prisma.compraPacote.count({ where: { usuarioId, pacoteId } });

export const criarCompra = (data) => prisma.compraPacote.create({ data });

export const encontrarCartaPorId = (id) =>
  prisma.carta.findUnique({ where: { id } });

export const listarCartasPorRaridade = (raridade) =>
  prisma.carta.findMany({ where: { raridade } });

export const encontrarCartaUsuario = (usuarioId, cartaId) =>
  prisma.cartaUsuario.findUnique({
    where: { usuarioId_cartaId: { usuarioId, cartaId } },
  });

export const criarCartaUsuario = (data) =>
  prisma.cartaUsuario.create({ data, include: { carta: true } });

export const atualizarCartaUsuario = (id, data) =>
  prisma.cartaUsuario.update({ where: { id }, data, include: { carta: true } });

export const encontrarTituloAtivo = async (usuarioId) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: { tituloAtivo: true },
  });
  return usuario?.tituloAtivo;
};

export const listarCartasPorPacote = (pacoteId) =>
  prisma.cartaPacote.findMany({
    where: { pacoteId },
    include: { carta: true },
  });
