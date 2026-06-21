import prisma from '../utils/prisma.js';

export const contagemHoje = (usuarioId) => {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + 1);

  return prisma.criacaoCartaDiaria.count({
    where: { usuarioId, criadoEm: { gte: inicio, lt: fim } },
  });
};

export const registrar = (data) =>
  prisma.criacaoCartaDiaria.create({ data });

export const criarCarta = (data) =>
  prisma.carta.create({
    data,
    include: { criador: { select: { id: true, nomeUsuario: true } } },
  });