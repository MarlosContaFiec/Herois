import * as sessaoRepo from "../repository/sessaoTroca.repository.js";
import * as guildaRepo from "../repository/guilda.repository.js";

export async function iniciar(usuarioId, guildaId) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== guildaId)
    throw new Error("Você não pertence a esta guilda");
  if (membro.papel === "MEMBRO")
    throw new Error("Apenas líder e vice podem iniciar sessão");

  const sessaoAtiva = await sessaoRepo.encontrarSessaoAtiva(guildaId);
  if (sessaoAtiva) throw new Error("Já existe uma sessão ativa");

  const expiraEm = new Date();
  expiraEm.setMinutes(expiraEm.getMinutes() + 30);

  return sessaoRepo.criarSessao({
    guildaId,
    iniciadaPorId: usuarioId,
    expiraEm,
  });
}

export async function obterAtiva(guildaId) {
  const sessao = await sessaoRepo.encontrarSessaoAtiva(guildaId);
  if (!sessao) throw new Error("Nenhuma sessão ativa");
  return sessao;
}

export async function colocarNaVitrine(
  usuarioId,
  sessaoId,
  cartaUsuarioId,
  precoPedido,
) {
  const sessao = await sessaoRepo.encontrarPorId(sessaoId);
  if (!sessao) throw new Error("Sessão não encontrada");
  if (new Date() > new Date(sessao.expiraEm))
    throw new Error("Sessão expirada");

  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== sessao.guildaId)
    throw new Error("Você não pertence a esta guilda");

  const listagens = await sessaoRepo.contarListagens(sessaoId, usuarioId);
  if (listagens >= 3) throw new Error("Máximo de 3 cartas na vitrine");

  const carta = await sessaoRepo.encontrarCartaUsuario(cartaUsuarioId);
  if (!carta || carta.usuarioId !== usuarioId)
    throw new Error("Carta não encontrada ou não pertence a você");

  return sessaoRepo.criarListagem({
    sessaoId,
    usuarioId,
    cartaUsuarioId,
    precoPedido: precoPedido || null,
  });
}

export async function fazerOferta(usuarioId, sessaoId, dados) {
  const sessao = await sessaoRepo.encontrarPorId(sessaoId);
  if (!sessao) throw new Error("Sessão não encontrada");
  if (new Date() > new Date(sessao.expiraEm))
    throw new Error("Sessão expirada");

  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== sessao.guildaId)
    throw new Error("Você não pertence a esta guilda");

  const listagem = await sessaoRepo.encontrarListagem(dados.listagemId);
  if (!listagem || listagem.sessaoId !== sessaoId)
    throw new Error("Listagem não encontrada");
  if (listagem.usuarioId === usuarioId)
    throw new Error("Não pode fazer oferta na sua própria carta");
  if (listagem.status !== "ATIVO") throw new Error("Listagem não está ativa");

  if (dados.cartasOfertadas?.length) {
    for (const cartaId of dados.cartasOfertadas) {
      const carta = await sessaoRepo.encontrarCartaUsuario(cartaId);
      if (!carta || carta.usuarioId !== usuarioId)
        throw new Error(`Carta ${cartaId} não pertence a você`);
    }
  }

  const oferta = await sessaoRepo.criarOferta({
    sessaoId,
    listagemId: dados.listagemId,
    ofertanteId: usuarioId,
    tipoOferta: dados.tipoOferta,
    ofertaMoedas: dados.ofertaMoedas || null,
    ofertaPacoteId: dados.ofertaPacoteId || null,
    ofertaTituloId: dados.ofertaTituloId || null,
  });

  if (dados.cartasOfertadas?.length) {
    for (const cartaId of dados.cartasOfertadas) {
      await sessaoRepo.criarOfertaCarta({
        ofertaId: oferta.id,
        cartaUsuarioId: cartaId,
      });
    }
  }

  return sessaoRepo.encontrarOferta(oferta.id);
}

async function limparReferenciasCarta(tx, cartaUsuarioId) {
  const listagens = await tx.listagemTroca.findMany({
    where: { cartaUsuarioId },
    include: { ofertas: { include: { cartasOfertadas: true } } },
  });

  for (const list of listagens) {
    for (const o of list.ofertas) {
      if (o.cartasOfertadas.length > 0) {
        await tx.ofertaTrocaCarta.deleteMany({ where: { ofertaId: o.id } });
      }
    }
    await tx.ofertaTroca.deleteMany({ where: { listagemId: list.id } });
    await tx.listagemTroca.delete({ where: { id: list.id } });
  }

  const ofertasCarta = await tx.ofertaTrocaCarta.findMany({
    where: { cartaUsuarioId },
  });

  for (const oc of ofertasCarta) {
    await tx.ofertaTrocaCarta.delete({ where: { id: oc.id } });
  }
}

export async function responderOferta(usuarioId, sessaoId, ofertaId, aceitar) {
  const sessao = await sessaoRepo.encontrarPorId(sessaoId);
  if (!sessao) throw new Error("Sessão não encontrada");
  if (new Date() > new Date(sessao.expiraEm))
    throw new Error("Sessão expirada");

  const oferta = await sessaoRepo.encontrarOferta(ofertaId);
  if (!oferta) throw new Error("Oferta não encontrada");
  if (oferta.listagem.usuarioId !== usuarioId)
    throw new Error("Esta carta não é sua");
  if (oferta.status !== "PENDENTE") throw new Error("Oferta já processada");

  if (!aceitar) {
    await sessaoRepo.atualizarOferta(ofertaId, { status: "REJEITADA" });
    return { status: "REJEITADA" };
  }

  const prisma = (await import("../utils/prisma.js")).default;
  const listagemId = oferta.listagemId;
  const cartaVendidaId = oferta.listagem.cartaUsuarioId;

  await prisma.$transaction(async (tx) => {
    const cartaVendida = await tx.cartaUsuario.findUnique({
      where: { id: cartaVendidaId },
      include: { carta: true },
    });

    const todasOfertas = await tx.ofertaTroca.findMany({
      where: { listagemId },
      include: { cartasOfertadas: true },
    });

    for (const o of todasOfertas) {
      if (o.cartasOfertadas.length > 0) {
        await tx.ofertaTrocaCarta.deleteMany({ where: { ofertaId: o.id } });
      }
    }

    await tx.ofertaTroca.deleteMany({ where: { listagemId } });
    await tx.listagemTroca.delete({ where: { id: listagemId } });

    await limparReferenciasCarta(tx, cartaVendidaId);

    await tx.cartaUsuario.delete({ where: { id: cartaVendidaId } });

    const jaTem = await tx.cartaUsuario.findUnique({
      where: {
        usuarioId_cartaId: {
          usuarioId: oferta.ofertanteId,
          cartaId: cartaVendida.cartaId,
        },
      },
    });

    if (jaTem) {
      const xpGanho =
        {
          COMUM: 5,
          INCOMUM: 15,
          RARA: 40,
          EPICA: 100,
          LENDARIA: 250,
          UNICA: 0,
        }[cartaVendida.carta.raridade] || 5;
      await tx.cartaUsuario.update({
        where: { id: jaTem.id },
        data: { xp: jaTem.xp + xpGanho },
      });
    } else {
      await tx.cartaUsuario.create({
        data: { usuarioId: oferta.ofertanteId, cartaId: cartaVendida.cartaId },
      });
    }

    if (oferta.tipoOferta === "MOEDAS" && oferta.ofertaMoedas) {
      const ofertante = await tx.usuario.findUnique({
        where: { id: oferta.ofertanteId },
      });
      const vendedor = await tx.usuario.findUnique({
        where: { id: usuarioId },
      });

      await tx.usuario.update({
        where: { id: oferta.ofertanteId },
        data: { moedas: ofertante.moedas - oferta.ofertaMoedas },
      });
      await tx.usuario.update({
        where: { id: usuarioId },
        data: { moedas: vendedor.moedas + oferta.ofertaMoedas },
      });
    }

    if (oferta.tipoOferta === "CARTA") {
      for (const oc of oferta.cartasOfertadas) {
        const cartaOfertada = await tx.cartaUsuario.findUnique({
          where: { id: oc.cartaUsuarioId },
          include: { carta: true },
        });

        if (!cartaOfertada) continue;

        await limparReferenciasCarta(tx, oc.cartaUsuarioId);

        await tx.cartaUsuario.delete({ where: { id: oc.cartaUsuarioId } });

        const jaTemVendedor = await tx.cartaUsuario.findUnique({
          where: {
            usuarioId_cartaId: { usuarioId, cartaId: cartaOfertada.cartaId },
          },
        });

        if (jaTemVendedor) {
          const xpGanho =
            {
              COMUM: 5,
              INCOMUM: 15,
              RARA: 40,
              EPICA: 100,
              LENDARIA: 250,
              UNICA: 0,
            }[cartaOfertada.carta.raridade] || 5;
          await tx.cartaUsuario.update({
            where: { id: jaTemVendedor.id },
            data: { xp: jaTemVendedor.xp + xpGanho },
          });
        } else {
          await tx.cartaUsuario.create({
            data: { usuarioId, cartaId: cartaOfertada.cartaId },
          });
        }
      }
    }

    if (oferta.tipoOferta === "PACOTE" && oferta.ofertaPacoteId) {
      await tx.pacoteUsuario.update({
        where: { id: oferta.ofertaPacoteId },
        data: { usuarioId },
      });
    }

    if (oferta.tipoOferta === "TITULO" && oferta.ofertaTituloId) {
      await tx.tituloUsuario.delete({
        where: {
          usuarioId_tituloId: {
            usuarioId: oferta.ofertanteId,
            tituloId: oferta.ofertaTituloId,
          },
        },
      });
      await tx.tituloUsuario.upsert({
        where: {
          usuarioId_tituloId: { usuarioId, tituloId: oferta.ofertaTituloId },
        },
        update: {},
        create: { usuarioId, tituloId: oferta.ofertaTituloId },
      });
    }
  });

  return { status: "ACEITA" };
}
