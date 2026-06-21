import prisma from '../utils/prisma.js';

function parseCondicao(condicaoStr) {
  if (!condicaoStr) return null;
  try { return JSON.parse(condicaoStr); } catch { return null; }
}

async function verificarCondicao(usuarioId, condicao) {
  if (!condicao) return true;

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: {
      titulosUsuario: { include: { titulo: true } },
      cartas: { include: { carta: true } },
    },
  });

  if (!usuario) return false;

  if (condicao.minNivel && usuario.nivel < condicao.minNivel) return false;

  if (condicao.missoesCompletadas) {
    const vitorias = await prisma.tentativaMissao.count({
      where: { usuarioId, resultado: 'VITORIA' },
    });
    if (vitorias < condicao.missoesCompletadas) return false;
  }

  if (condicao.tituloEspecifico) {
    const tem = usuario.titulosUsuario.some(
      (tu) => tu.titulo.nome === condicao.tituloEspecifico
    );
    if (!tem) return false;
  }

  if (condicao.qtdCartasElemento) {
    const { elemento, quantidade } = condicao.qtdCartasElemento;
    const count = usuario.cartas.filter((cu) => cu.carta.elemento === elemento).length;
    if (count < quantidade) return false;
  }

  if (condicao.qtdCartasClasse) {
    const { classe, quantidade } = condicao.qtdCartasClasse;
    const count = usuario.cartas.filter((cu) => cu.carta.classe === classe).length;
    if (count < quantidade) return false;
  }

  return true;
}

export async function obterProgressao(usuarioId) {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw new Error('Usuário não encontrado');

  const vitorias = await prisma.tentativaMissao.count({
    where: { usuarioId, resultado: 'VITORIA' },
  });

  const totalCartas = await prisma.cartaUsuario.count({
    where: { usuarioId },
  });

  const pacotes = await prisma.pacote.findMany({
    where: { secreto: false },
    orderBy: { custo: 'asc' },
  });

  const pacotesDesbloqueados = [];
  const pacotesBloqueados = [];

  for (const pacote of pacotes) {
    const condicao = parseCondicao(pacote.condicaoDesbloqueio);
    const desbloqueado = await verificarCondicao(usuarioId, condicao);

    if (desbloqueado) {
      pacotesDesbloqueados.push(pacote);
    } else {
      pacotesBloqueados.push({ ...pacote, condicao });
    }
  }

  const titulos = await prisma.titulo.findMany();
  const titulosDoUsuario = await prisma.tituloUsuario.findMany({
    where: { usuarioId },
    select: { tituloId: true },
  });
  const idsPossuidos = new Set(titulosDoUsuario.map((t) => t.tituloId));

  const titulosDesbloqueados = titulos.filter((t) => idsPossuidos.has(t.id));
  const titulosBloqueados = titulos.filter((t) => !idsPossuidos.has(t.id));

  const comprasPorPacote = await prisma.compraPacote.groupBy({
    by: ['pacoteId'],
    where: { usuarioId },
    _count: true,
  });

  const pacotesBonus = [];
  for (const cp of comprasPorPacote) {
    if (cp._count >= 100) {
      const pacote = await prisma.pacote.findFirst({
        where: { pacotePaiId: cp.pacoteId },
      });
      if (pacote) pacotesBonus.push(pacote);
    }
  }

  return {
    usuario: { nivel: usuario.nivel, experiencia: usuario.experiencia, moedas: usuario.moedas },
    estatisticas: { missoesCompletadas: vitorias, totalCartas },
    pacotesDesbloqueados,
    pacotesBloqueados,
    pacotesBonus,
    titulosDesbloqueados,
    titulosBloqueados,
  };
}

export async function verificarDesbloqueios(usuarioId) {
  const pacotes = await prisma.pacote.findMany({
    where: { condicaoDesbloqueio: { not: null } },
  });

  const novosDesbloqueios = [];

  for (const pacote of pacotes) {
    const condicao = parseCondicao(pacote.condicaoDesbloqueio);
    const desbloqueado = await verificarCondicao(usuarioId, condicao);
    if (desbloqueado) {
      novosDesbloqueios.push({ tipo: 'PACOTE', id: pacote.id, nome: pacote.nome });
    }
  }

  return novosDesbloqueios;
}