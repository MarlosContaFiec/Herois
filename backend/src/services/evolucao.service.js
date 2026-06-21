import * as evolucaoRepo from '../repository/evolucao.repository.js';
import * as usuarioRepo from '../repository/usuario.repository.js';
import {
  ORDEM_RARIDADE,
  CUSTO_EVOLUCAO,
  xpParaNivel,
  FAIXA_PODER,
} from '../utils/constantes.js';

let contadorSerieGlobal = null;

async function obterProximoSerie() {
  if (contadorSerieGlobal === null) {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const ultima = await prisma.cartaUsuario.findFirst({
      where: { serieEvolucao: { not: null } },
      orderBy: { serieEvolucao: 'desc' },
    });
    await prisma.$disconnect();
    contadorSerieGlobal = ultima ? ultima.serieEvolucao + 1 : 1;
  } else {
    contadorSerieGlobal++;
  }
  return contadorSerieGlobal;
}

export async function evoluir(usuarioId, cartaUsuarioId) {
  const usuario = await usuarioRepo.encontrarPorId(usuarioId);
  if (!usuario) throw new Error('Usuário não encontrado');

  const cu = await evolucaoRepo.encontrarCartaUsuario(cartaUsuarioId);
  if (!cu) throw new Error('Carta não encontrada');
  if (cu.usuarioId !== usuarioId) throw new Error('Esta carta não pertence a você');

  const raridadeAtual = ORDEM_RARIDADE[ORDEM_RARIDADE.indexOf(cu.carta.raridade) + cu.contagemEvoluida];
  if (!raridadeAtual) throw new Error('Raridade atual inválida');

  const idxRaridade = ORDEM_RARIDADE.indexOf(raridadeAtual);
  if (idxRaridade >= ORDEM_RARIDADE.length - 2) {
    throw new Error('Carta já está na raridade máxima evoluível');
  }

  const xpNecessario = xpParaNivel(cu.nivel, cu.contagemEvoluida);
  if (cu.nivel < 10) {
    throw new Error(`Carta precisa estar no nível 10 para evoluir. Nível atual: ${cu.nivel}`);
  }

  const custo = CUSTO_EVOLUCAO[raridadeAtual];
  if (!custo) throw new Error('Não é possível evoluir desta raridade');
  if (usuario.moedas < custo) throw new Error(`Moedas insuficientes. Custo: ${custo}`);

  const novaContagem = cu.contagemEvoluida + 1;
  const novaRaridade = ORDEM_RARIDADE[idxRaridade + 1];
  const novaFaixa = FAIXA_PODER[novaRaridade];
  const novoPoder = Math.floor(novaFaixa.min + (novaFaixa.max - novaFaixa.min) * 0.5);
  const novaSerie = await obterProximoSerie();

  const cartaAtualizada = await evolucaoRepo.atualizar(cartaUsuarioId, {
    contagemEvoluida: novaContagem,
    nivel: 1,
    xp: 0,
    serieEvolucao: novaSerie,
  });

  await evolucaoRepo.atualizarUsuario(usuarioId, {
    moedas: usuario.moedas - custo,
  });

  const idxNome = Math.min(idxRaridade + 1, ORDEM_RARIDADE.length - 1);
  const sufixo = ['', ' +', ' ++', ' +++', ' #'][Math.min(novaContagem, 4)] || ' #';

  return {
    carta: cartaAtualizada,
    raridadeAnterior: raridadeAtual,
    novaRaridade,
    novoPoder,
    sufixo,
    serieEvolucao: novaSerie,
    custoPago: custo,
    moedasRestantes: usuario.moedas - custo,
  };
}