import prisma from "../utils/prisma.js";

export const criar = (data) =>
  prisma.guilda.create({
    data,
    include: {
      membros: true,
      criador: { select: { id: true, nomeUsuario: true } },
    },
  });

export const encontrarPorId = (id) =>
  prisma.guilda.findUnique({
    where: { id },
    include: {
      criador: { select: { id: true, nomeUsuario: true } },
      membros: {
        include: {
          usuario: { select: { id: true, nomeUsuario: true, nivel: true } },
        },
      },
    },
  });

export const encontrarPorNome = (nome) =>
  prisma.guilda.findUnique({ where: { nome } });

export const listarTodas = () =>
  prisma.guilda.findMany({
    include: {
      criador: { select: { id: true, nomeUsuario: true } },
      membros: { select: { id: true } },
    },
    orderBy: { criadoEm: "desc" },
  });

export const encontrarMembro = (usuarioId) =>
  prisma.membroGuilda.findUnique({
    where: { usuarioId },
    include: { guilda: true },
  });

export const criarMembro = (data) => prisma.membroGuilda.create({ data });

export const removerMembro = (usuarioId) =>
  prisma.membroGuilda.delete({ where: { usuarioId } });

export const atualizarMembro = (usuarioId, data) =>
  prisma.membroGuilda.update({ where: { usuarioId }, data });

export const atualizarGuilda = (id, data) =>
  prisma.guilda.update({ where: { id }, data });

export const contarMembros = (guildaId) =>
  prisma.membroGuilda.count({ where: { guildaId } });

export const criarPedido = (data) => prisma.pedidoGuilda.create({ data });

export const encontrarPedido = (guildaId, usuarioId) =>
  prisma.pedidoGuilda.findUnique({
    where: { guildaId_usuarioId: { guildaId, usuarioId } },
  });

export const listarPedidos = (guildaId) =>
  prisma.pedidoGuilda.findMany({
    where: { guildaId, status: "PENDENTE" },
    include: {
      usuario: { select: { id: true, nomeUsuario: true, nivel: true } },
    },
  });

export const atualizarPedido = (id, data) =>
  prisma.pedidoGuilda.update({ where: { id }, data });

export const encontrarPedidoPorId = (id) =>
  prisma.pedidoGuilda.findUnique({
    where: { id },
    include: { usuario: true },
  });

export const deletar = (id) => prisma.guilda.delete({ where: { id } });

export const encontrarMinhaGuilda = (usuarioId) =>
  prisma.membroGuilda.findUnique({
    where: { usuarioId },
    include: {
      guilda: {
        include: {
          criador: { select: { id: true, nomeUsuario: true } },
          membros: {
            include: {
              usuario: { select: { id: true, nomeUsuario: true, nivel: true } },
            },
          },
        },
      },
    },
  });
