import prisma from '../utils/prisma.js';

export const encontrarSessaoAtiva = (guildaId) =>
  prisma.sessaoTroca.findFirst({
    where: { guildaId, expiraEm: { gt: new Date() } },
    include: {
      listagens: {
        include: {
          usuario: { select: { id: true, nomeUsuario: true } },
          cartaUsuario: { include: { carta: true } },
          ofertas: {
            include: {
              ofertante: { select: { id: true, nomeUsuario: true } },
              ofertaCarta: { include: { carta: true } },
            },
          },
        },
      },
      iniciadaPor: { select: { id: true, nomeUsuario: true } },
    },
  });

export const criarSessao = (data) =>
  prisma.sessaoTroca.create({
    data,
    include: { guilda: true, iniciadaPor: { select: { id: true, nomeUsuario: true } } },
  });

export const encontrarPorId = (id) =>
  prisma.sessaoTroca.findUnique({
    where: { id },
    include: {
      listagens: {
        include: {
          usuario: { select: { id: true, nomeUsuario: true } },
          cartaUsuario: { include: { carta: true } },
          ofertas: {
            include: {
              ofertante: { select: { id: true, nomeUsuario: true } },
              ofertaCarta: { include: { carta: true } },
            },
          },
        },
      },
      iniciadaPor: { select: { id: true, nomeUsuario: true } },
    },
  });

export const contarListagens = (sessaoId, usuarioId) =>
  prisma.listagemTroca.count({ where: { sessaoId, usuarioId } });

export const criarListagem = (data) =>
  prisma.listagemTroca.create({
    data,
    include: {
      usuario: { select: { id: true, nomeUsuario: true } },
      cartaUsuario: { include: { carta: true } },
    },
  });

export const encontrarListagem = (id) =>
  prisma.listagemTroca.findUnique({
    where: { id },
    include: {
      cartaUsuario: { include: { carta: true } },
      usuario: true,
      ofertas: true,
    },
  });

export const atualizarListagem = (id, data) =>
  prisma.listagemTroca.update({ where: { id }, data });

export const criarOferta = (data) =>
  prisma.ofertaTroca.create({
    data,
    include: { ofertante: { select: { id: true, nomeUsuario: true } } },
  });

export const encontrarOferta = (id) =>
  prisma.ofertaTroca.findUnique({
    where: { id },
    include: {
      listagem: { include: { cartaUsuario: true, usuario: true } },
      ofertante: true,
      ofertaCarta: { include: { carta: true } },
      ofertaPacote: { include: { pacote: true } },
      ofertaTitulo: { include: { titulo: true } },
    },
  });

export const atualizarOferta = (id, data) =>
  prisma.ofertaTroca.update({ where: { id }, data });

export const atualizarCartaUsuario = (id, data) =>
  prisma.cartaUsuario.update({ where: { id }, data });

export const encontrarCartaUsuario = (id) =>
  prisma.cartaUsuario.findUnique({ where: { id }, include: { carta: true } });

export const deletarCartaUsuario = (id) =>
  prisma.cartaUsuario.delete({ where: { id } });

export const encontrarOuCriarCartaUsuario = (usuarioId, cartaId) =>
  prisma.cartaUsuario.upsert({
    where: { usuarioId_cartaId: { usuarioId, cartaId } },
    update: {},
    create: { usuarioId, cartaId },
    include: { carta: true },
  });

export const atualizarUsuario = (id, data) =>
  prisma.usuario.update({ where: { id }, data });

export const encontrarUsuario = (id) =>
  prisma.usuario.findUnique({ where: { id } });

export const transferirTitulo = (deUsuarioId, paraUsuarioId, tituloId) =>
  prisma.$transaction([
    prisma.tituloUsuario.delete({
      where: { usuarioId_tituloId: { usuarioId: deUsuarioId, tituloId } },
    }),
    prisma.tituloUsuario.upsert({
      where: { usuarioId_tituloId: { usuarioId: paraUsuarioId, tituloId } },
      update: {},
      create: { usuarioId: paraUsuarioId, tituloId },
    }),
  ]);