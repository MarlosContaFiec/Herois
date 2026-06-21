import * as sessaoRepo from '../repository/sessaoTroca.repository.js';
import * as guildaRepo from '../repository/guilda.repository.js';

export async function iniciar(usuarioId, guildaId) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== guildaId) throw new Error('Você não pertence a esta guilda');
  if (membro.papel === 'MEMBRO') throw new Error('Apenas líder e vice podem iniciar sessão');

  const sessaoAtiva = await sessaoRepo.encontrarSessaoAtiva(guildaId);
  if (sessaoAtiva) throw new Error('Já existe uma sessão ativa');

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
  if (!sessao) throw new Error('Nenhuma sessão ativa');
  return sessao;
}

export async function colocarNaVitrine(usuarioId, sessaoId, cartaUsuarioId, precoPedido) {
  const sessao = await sessaoRepo.encontrarPorId(sessaoId);
  if (!sessao) throw new Error('Sessão não encontrada');
  if (new Date() > new Date(sessao.expiraEm)) throw new Error('Sessão expirada');

  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== sessao.guildaId) throw new Error('Você não pertence a esta guilda');

  const listagens = await sessaoRepo.contarListagens(sessaoId, usuarioId);
  if (listagens >= 3) throw new Error('Máximo de 3 cartas na vitrine');

  const carta = await sessaoRepo.encontrarCartaUsuario(cartaUsuarioId);
  if (!carta || carta.usuarioId !== usuarioId) throw new Error('Carta não encontrada ou não pertence a você');

  return sessaoRepo.criarListagem({
    sessaoId,
    usuarioId,
    cartaUsuarioId,
    precoPedido: precoPedido || null,
  });
}

export async function fazerOferta(usuarioId, sessaoId, dados) {
  const sessao = await sessaoRepo.encontrarPorId(sessaoId);
  if (!sessao) throw new Error('Sessão não encontrada');
  if (new Date() > new Date(sessao.expiraEm)) throw new Error('Sessão expirada');

  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== sessao.guildaId) throw new Error('Você não pertence a esta guilda');

  const listagem = await sessaoRepo.encontrarListagem(dados.listagemId);
  if (!listagem || listagem.sessaoId !== sessaoId) throw new Error('Listagem não encontrada');
  if (listagem.usuarioId === usuarioId) throw new Error('Não pode fazer oferta na sua própria carta');
  if (listagem.status !== 'ATIVO') throw new Error('Listagem não está ativa');

  return sessaoRepo.criarOferta({
    sessaoId,
    listagemId: dados.listagemId,
    ofertanteId: usuarioId,
    tipoOferta: dados.tipoOferta,
    ofertaMoedas: dados.ofertaMoedas || null,
    ofertaCartaId: dados.ofertaCartaId || null,
    ofertaPacoteId: dados.ofertaPacoteId || null,
    ofertaTituloId: dados.ofertaTituloId || null,
  });
}

export async function responderOferta(usuarioId, sessaoId, ofertaId, aceitar) {
  const sessao = await sessaoRepo.encontrarPorId(sessaoId);
  if (!sessao) throw new Error('Sessão não encontrada');
  if (new Date() > new Date(sessao.expiraEm)) throw new Error('Sessão expirada');

  const oferta = await sessaoRepo.encontrarOferta(ofertaId);
  if (!oferta) throw new Error('Oferta não encontrada');
  if (oferta.listagem.usuarioId !== usuarioId) throw new Error('Esta carta não é sua');
  if (oferta.status !== 'PENDENTE') throw new Error('Oferta já processada');

  if (!aceitar) {
    await sessaoRepo.atualizarOferta(ofertaId, { status: 'REJEITADA' });
    return { status: 'REJEITADA' };
  }

  const prisma = (await import('../utils/prisma.js')).default;

  await prisma.$transaction(async (tx) => {
    const cartaVendida = await tx.cartaUsuario.findUnique({
      where: { id: oferta.listagem.cartaUsuarioId },
      include: { carta: true },
    });

    await tx.cartaUsuario.delete({ where: { id: oferta.listagem.cartaUsuarioId } });

    const jaTem = await tx.cartaUsuario.findUnique({
      where: { usuarioId_cartaId: { usuarioId: oferta.ofertanteId, cartaId: cartaVendida.cartaId } },
    });

    if (jaTem) {
      const xpGanho = { COMUM: 5, INCOMUM: 15, RARA: 40, EPICA: 100, LENDARIA: 250, UNICA: 0 }[cartaVendida.carta.raridade] || 5;
      await tx.cartaUsuario.update({
        where: { id: jaTem.id },
        data: { xp: jaTem.xp + xpGanho },
      });
    } else {
      await tx.cartaUsuario.create({
        data: { usuarioId: oferta.ofertanteId, cartaId: cartaVendida.cartaId },
      });
    }

    if (oferta.tipoOferta === 'MOEDAS' && oferta.ofertaMoedas) {
      const ofertante = await tx.usuario.findUnique({ where: { id: oferta.ofertanteId } });
      const vendedor = await tx.usuario.findUnique({ where: { id: usuarioId } });

      await tx.usuario.update({
        where: { id: oferta.ofertanteId },
        data: { moedas: ofertante.moedas - oferta.ofertaMoedas },
      });
      await tx.usuario.update({
        where: { id: usuarioId },
        data: { moedas: vendedor.moedas + oferta.ofertaMoedas },
      });
    }

    if (oferta.tipoOferta === 'CARTA' && oferta.ofertaCartaId) {
      const cartaOfertada = await tx.cartaUsuario.findUnique({
        where: { id: oferta.ofertaCartaId },
        include: { carta: true },
      });

      await tx.cartaUsuario.delete({ where: { id: oferta.ofertaCartaId } });

      const jaTemVendedor = await tx.cartaUsuario.findUnique({
        where: { usuarioId_cartaId: { usuarioId, cartaId: cartaOfertada.cartaId } },
      });

      if (jaTemVendedor) {
        const xpGanho = { COMUM: 5, INCOMUM: 15, RARA: 40, EPICA: 100, LENDARIA: 250, UNICA: 0 }[cartaOfertada.carta.raridade] || 5;
        await tx.cartaUsuario.update({
          where: { id: jaTemVendedor.id },
          data: { xp: 0 },
        });
      } else {
        await tx.cartaUsuario.create({
          data: { usuarioId, cartaId: cartaOfertada.cartaId },
        });
      }
    }

    if (oferta.tipoOferta === 'PACOTE' && oferta.ofertaPacoteId) {
      await tx.pacoteUsuario.update({
        where: { id: oferta.ofertaPacoteId },
        data: { usuarioId },
      });
    }

    if (oferta.tipoOferta === 'TITULO' && oferta.ofertaTituloId) {
      await tx.tituloUsuario.delete({
        where: { usuarioId_tituloId: { usuarioId: oferta.ofertanteId, tituloId: oferta.ofertaTituloId } },
      });
      await tx.tituloUsuario.upsert({
        where: { usuarioId_tituloId: { usuarioId, tituloId: oferta.ofertaTituloId } },
        update: {},
        create: { usuarioId, tituloId: oferta.ofertaTituloId },
      });
    }

    await tx.ofertaTroca.update({ where: { id: ofertaId }, data: { status: 'ACEITA' } });
    await tx.listagemTroca.update({ where: { id: oferta.listagemId }, data: { status: 'VENDIDO' } });
  });

  return { status: 'ACEITA' };
}