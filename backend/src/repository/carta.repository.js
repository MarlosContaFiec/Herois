import prisma from "../utils/prisma.js";

const includeCompleto = {
  criador: { select: { id: true, nomeUsuario: true } },
  pacotesCarta: { include: { pacote: true } },
};

export const encontrarPorId = (id) =>
  prisma.carta.findUnique({
    where: { id },
    include: includeCompleto,
  });

export const encontrarPorNome = (nome) =>
  prisma.carta.findFirst({ where: { nome } });

export const listarTodos = (filtros = {}) => {
  const where = {};
  if (filtros.elemento) where.elemento = filtros.elemento;
  if (filtros.classe) where.classe = filtros.classe;
  if (filtros.raridade) where.raridade = filtros.raridade;
  if (filtros.nome)
    where.nome = { contains: filtros.nome, mode: "insensitive" };

  return prisma.carta.findMany({
    where,
    include: includeCompleto,
    orderBy: { criadoEm: "desc" },
  });
};

export const criar = (data) =>
  prisma.carta.create({
    data,
    include: includeCompleto,
  });

export const atualizar = (id, data) =>
  prisma.carta.update({
    where: { id },
    data,
    include: includeCompleto,
  });

export const deletar = (id) => prisma.carta.delete({ where: { id } });
