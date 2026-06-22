import prisma from "../utils/prisma.js";
import { CUSTO_IMPORTAR, CUSTO_ESCOLHER_PACOTE } from "./criacao.service.js";

export async function listarColecao(usuarioId) {
  const cartas = await prisma.cartaUsuario.findMany({
    where: { usuarioId },
    include: {
      carta: {
        include: {
          pacotesCarta: { include: { pacote: true } },
        },
      },
    },
    orderBy: [{ favorito: "desc" }, { adquiridoEm: "desc" }],
  });
  return cartas;
}

export async function adicionarCarta(usuarioId, cartaId, pacoteId) {
  const carta = await prisma.carta.findUnique({ where: { id: cartaId } });
  if (!carta) throw new Error("Carta nao encontrada");
  if (carta.raridade === "UNICA")
    throw new Error("Cartas unicas nao podem ser importadas");
  if (carta.criadorId !== usuarioId)
    throw new Error("Voce so pode importar cartas que voce mesmo criou");

  const jaTem = await prisma.cartaUsuario.findUnique({
    where: { usuarioId_cartaId: { usuarioId, cartaId } },
  });
  if (jaTem) throw new Error("Voce ja possui esta carta");

  const custoBase = CUSTO_IMPORTAR[carta.raridade] || 100;
  const custoPacote = pacoteId ? CUSTO_ESCOLHER_PACOTE : 0;
  const custoTotal = custoBase + custoPacote;

  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw new Error("Usuario nao encontrado");
  if (usuario.moedas < custoTotal)
    throw new Error(`Moedas insuficientes. Necessario: ${custoTotal}`);

  if (pacoteId) {
    const pacote = await prisma.pacote.findUnique({ where: { id: pacoteId } });
    if (!pacote) throw new Error("Pacote nao encontrado");

    const jaExiste = await prisma.cartaPacote.findUnique({
      where: { cartaId_pacoteId: { cartaId, pacoteId } },
    });
    if (!jaExiste) {
      await prisma.cartaPacote.create({ data: { cartaId, pacoteId } });
    }
  }

  await prisma.usuario.update({
    where: { id: usuarioId },
    data: { moedas: { decrement: custoTotal } },
  });

  const cartaUsuario = await prisma.cartaUsuario.create({
    data: { usuarioId, cartaId },
    include: { carta: true },
  });

  return { cartaUsuario, custoPago: custoTotal };
}

export async function removerCarta(usuarioId, cartaId) {
  const carta = await prisma.cartaUsuario.findUnique({
    where: { usuarioId_cartaId: { usuarioId, cartaId } },
  });

  if (!carta) throw new Error("Carta não encontrada na sua coleção");
  if (carta.favorito)
    throw new Error(
      "Não é possível remover uma carta favorita. Desfavorite primeiro",
    );

  await prisma.cartaUsuario.delete({
    where: { usuarioId_cartaId: { usuarioId, cartaId } },
  });

  return { sucesso: true };
}
export async function favoritarCarta(usuarioId, cartaId) {
  const existente = await prisma.cartaUsuario.findUnique({
    where: { usuarioId_cartaId: { usuarioId, cartaId } },
  });
  if (!existente) throw new Error("Carta nao encontrada na colecao");

  const atualizado = await prisma.cartaUsuario.update({
    where: { id: existente.id },
    data: { favorito: !existente.favorito },
  });

  return atualizado;
}

export async function detalhesCarta(usuarioId, cartaId) {
  const carta = await prisma.carta.findUnique({
    where: { id: cartaId },
    include: {
      criador: { select: { id: true, nomeUsuario: true } },
      pacotesCarta: { include: { pacote: true } },
    },
  });
  if (!carta) throw new Error("Carta nao encontrada");

  const totalDonos = await prisma.cartaUsuario.count({
    where: { cartaId },
  });

  const meu = await prisma.cartaUsuario.findUnique({
    where: { usuarioId_cartaId: { usuarioId, cartaId } },
  });

  let numeroSerie = null;
  if (carta.criadorId === usuarioId) {
    numeroSerie = 0;
  } else if (meu) {
    const antes = await prisma.cartaUsuario.count({
      where: {
        cartaId,
        adquiridoEm: { lt: meu.adquiridoEm },
      },
    });
    numeroSerie = antes + 1;
  }

  return { carta, totalDonos, numeroSerie };
}
