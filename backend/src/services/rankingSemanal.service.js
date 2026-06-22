import prisma from "../utils/prisma.js";

function obterInicioSemana() {
  const hoje = new Date();
  const dia = hoje.getDay();
  const diff = hoje.getDate() - dia + (dia === 0 ? -6 : 1);
  const inicio = new Date(hoje.setDate(diff));
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

export async function atualizarEstatisticas(usuarioId, tipo, valor = 1) {
  const semanaInicio = obterInicioSemana();

  const campo = {
    PACOTE_ABERTO: "pacotesAbertos",
    MISSAO_COMPLETA: "missoesCompletadas",
    BOSS_DANO: "danoBossTotal",
  }[tipo];

  if (!campo) return;

  const existente = await prisma.estatisticaSemanal.findUnique({
    where: { usuarioId_semanaInicio: { usuarioId, semanaInicio } },
  });

  if (existente) {
    await prisma.estatisticaSemanal.update({
      where: { id: existente.id },
      data: { [campo]: { increment: valor } },
    });
  } else {
    await prisma.estatisticaSemanal.create({
      data: { usuarioId, semanaInicio, [campo]: valor },
    });
  }
}

export async function obterRanking() {
  const semanaInicio = obterInicioSemana();

  const stats = await prisma.estatisticaSemanal.findMany({
    where: { semanaInicio },
    include: {},
  });

  const usuariosIds = [...new Set(stats.map((s) => s.usuarioId))];
  const usuarios = await prisma.usuario.findMany({
    where: { id: { in: usuariosIds } },
    select: { id: true, nomeUsuario: true },
  });
  const mapaUsuarios = Object.fromEntries(usuarios.map((u) => [u.id, u]));

  const rankingPacotes = [...stats]
    .sort((a, b) => b.pacotesAbertos - a.pacotesAbertos)
    .slice(0, 10)
    .map((s) => ({
      usuario: mapaUsuarios[s.usuarioId]?.nomeUsuario,
      valor: s.pacotesAbertos,
    }));

  const rankingMissoes = [...stats]
    .sort((a, b) => b.missoesCompletadas - a.missoesCompletadas)
    .slice(0, 10)
    .map((s) => ({
      usuario: mapaUsuarios[s.usuarioId]?.nomeUsuario,
      valor: s.missoesCompletadas,
    }));

  const rankingBoss = [...stats]
    .sort((a, b) => b.danoBossTotal - a.danoBossTotal)
    .slice(0, 10)
    .map((s) => ({
      usuario: mapaUsuarios[s.usuarioId]?.nomeUsuario,
      valor: s.danoBossTotal,
    }));

  const vencedores = {
    maisPacotes: rankingPacotes[0] || null,
    maisMissoes: rankingMissoes[0] || null,
    melhorGuilda: rankingBoss[0] || null,
  };

  return {
    semanaInicio,
    rankingPacotes,
    rankingMissoes,
    rankingBoss,
    vencedores,
    premio: "O vencedor de cada critério pode criar 1 carta Única",
  };
}

export async function obterMinhasEstatisticas(usuarioId) {
  const semanaInicio = obterInicioSemana();

  const stat = await prisma.estatisticaSemanal.findUnique({
    where: { usuarioId_semanaInicio: { usuarioId, semanaInicio } },
  });

  return stat || { pacotesAbertos: 0, missoesCompletadas: 0, danoBossTotal: 0 };
}
