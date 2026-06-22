import * as streakRepo from "../repository/streak.repository.js";

const CUSTO_ESCUDO = 500;

const RECOMPENSAS_SEMANA_1 = {
  1: { tipo: "MOEDAS", valor: 10 },
  2: { tipo: "MOEDAS", valor: 15 },
  3: { tipo: "MOEDAS", valor: 20 },
  4: { tipo: "MOEDAS", valor: 30 },
  5: { tipo: "MOEDAS", valor: 50 },
  6: { tipo: "CARTA_RARA", valor: 1 },
  7: { tipo: "PACOTE", valor: 1 },
};

const RECOMPENSAS_CICLO = {
  8: { tipo: "MOEDAS", valor: 150 },
  9: { tipo: "MOEDAS", valor: 175 },
  10: { tipo: "MOEDAS", valor: 200 },
  11: { tipo: "MOEDAS", valor: 225 },
  12: { tipo: "MOEDAS", valor: 250 },
  13: { tipo: "CARTA_EPICA", valor: 1 },
  14: { tipo: "PACOTE", valor: 2 },
};

function obterDiaEfetivo(sequencia) {
  if (sequencia <= 0) return 1;
  if (sequencia <= 7) return sequencia;
  return ((sequencia - 8) % 7) + 8;
}

function obterRecompensa(dia) {
  if (dia <= 7) return RECOMPENSAS_SEMANA_1[dia];
  return RECOMPENSAS_CICLO[dia];
}

function obterPacoteDoDia() {
  const hoje = new Date();
  const inicioAno = new Date(hoje.getFullYear(), 0, 0);
  return Math.floor((hoje - inicioAno) / (1000 * 60 * 60 * 24));
}

function calcularEstado(usuario) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  let jaReclamouHoje = false;
  let diasDesdeUltimoClaim = null;
  let streakQuebrado = false;
  let escudoUsado = false;
  let sequencia = usuario.sequenciaLogin;

  if (usuario.ultimoClaimStreak) {
    const ultimoClaim = new Date(usuario.ultimoClaimStreak);
    ultimoClaim.setHours(0, 0, 0, 0);
    diasDesdeUltimoClaim = Math.floor(
      (hoje - ultimoClaim) / (1000 * 60 * 60 * 24),
    );
    jaReclamouHoje = diasDesdeUltimoClaim === 0;
  }

  if (
    sequencia > 0 &&
    diasDesdeUltimoClaim !== null &&
    diasDesdeUltimoClaim >= 2
  ) {
    streakQuebrado = true;
    if (usuario.escudos > 0) {
      escudoUsado = true;
    }
    sequencia = 1;
  }

  return { jaReclamouHoje, streakQuebrado, escudoUsado, sequencia };
}

export async function obterStatus(usuarioId) {
  const usuario = await streakRepo.encontrarUsuario(usuarioId);
  if (!usuario) throw new Error("Usuário não encontrado");

  const estado = calcularEstado(usuario);

  const diaEfetivo = obterDiaEfetivo(estado.sequencia);
  const recompensa = obterRecompensa(diaEfetivo);

  const proximoDia = Math.max(1, estado.sequencia) + 1;
  const proximoEfetivo = obterDiaEfetivo(proximoDia);
  const proximaRecompensa = obterRecompensa(proximoEfetivo);

  return {
    sequenciaLogin: usuario.sequenciaLogin,
    diaEfetivo,
    recompensaAtual: recompensa,
    jaReclamouHoje: estado.jaReclamouHoje,
    proximaRecompensa,
    escudos: usuario.escudos,
    streakQuebrado: estado.streakQuebrado,
    escudoUsado: estado.escudoUsado,
  };
}

export async function resgatar(usuarioId) {
  const usuario = await streakRepo.encontrarUsuario(usuarioId);
  if (!usuario) throw new Error("Usuário não encontrado");

  const estado = calcularEstado(usuario);

  if (estado.jaReclamouHoje) {
    throw new Error("Recompensa já resgatada hoje");
  }

  let usuarioAtual = usuario;

  if (estado.streakQuebrado) {
    const resetData = {
      sequenciaLogin: 1,
      ultimoClaimStreak: null,
    };
    if (estado.escudoUsado) {
      resetData.escudos = usuario.escudos - 1;
    }
    await streakRepo.atualizar(usuarioId, resetData);
    usuarioAtual = await streakRepo.encontrarUsuario(usuarioId);
  }

  const sequenciaAtual =
    usuarioAtual.sequenciaLogin <= 0 ? 1 : usuarioAtual.sequenciaLogin;
  const diaEfetivo = obterDiaEfetivo(sequenciaAtual);
  const recompensa = obterRecompensa(diaEfetivo);
  if (!recompensa) throw new Error("Dia de recompensa inválido");

  const updateData = {
    ultimoClaimStreak: new Date(),
    sequenciaLogin: sequenciaAtual + 1,
  };

  let resultado;

  if (recompensa.tipo === "MOEDAS") {
    updateData.moedas = usuarioAtual.moedas + recompensa.valor;
    resultado = {
      tipo: "MOEDAS",
      valor: recompensa.valor,
      moedasTotal: updateData.moedas,
    };
  }

  if (recompensa.tipo === "CARTA_RARA") {
    const carta = await streakRepo.encontrarCartaAleatoriaPorRaridade("RARA");
    if (carta) {
      const existente = await streakRepo.encontrarCartaUsuario(
        usuarioId,
        carta.id,
      );
      if (existente) {
        await streakRepo.atualizarCartaUsuario(existente.id, {
          xp: existente.xp + 40,
        });
        resultado = {
          tipo: "CARTA_RARA",
          carta,
          status: "DUPLICATA",
          xpGanho: 40,
        };
      } else {
        await streakRepo.criarCartaUsuario({ usuarioId, cartaId: carta.id });
        resultado = { tipo: "CARTA_RARA", carta, status: "NOVA" };
      }
    }
  }

  if (recompensa.tipo === "CARTA_EPICA") {
    const carta = await streakRepo.encontrarCartaAleatoriaPorRaridade("EPICA");
    if (carta) {
      const existente = await streakRepo.encontrarCartaUsuario(
        usuarioId,
        carta.id,
      );
      if (existente) {
        await streakRepo.atualizarCartaUsuario(existente.id, {
          xp: existente.xp + 100,
        });
        resultado = {
          tipo: "CARTA_EPICA",
          carta,
          status: "DUPLICATA",
          xpGanho: 100,
        };
      } else {
        await streakRepo.criarCartaUsuario({ usuarioId, cartaId: carta.id });
        resultado = { tipo: "CARTA_EPICA", carta, status: "NOVA" };
      }
    }
  }

  if (recompensa.tipo === "PACOTE") {
    const pacotes = await streakRepo.encontrarUserPacks();
    const pacote = pacotes[obterPacoteDoDia() % pacotes.length];
    const pacotesCriados = [];
    for (let i = 0; i < recompensa.valor; i++) {
      const pu = await streakRepo.criarPacoteUsuario({
        usuarioId,
        pacoteId: pacote.id,
        origem: "STREAK",
      });
      pacotesCriados.push(pu);
    }
    resultado = {
      tipo: "PACOTE",
      quantidade: recompensa.valor,
      pacote: { id: pacote.id, nome: pacote.nome },
      pacotesCriados,
    };
  }

  await streakRepo.atualizar(usuarioId, updateData);

  return resultado;
}

export async function comprarEscudo(usuarioId) {
  const usuario = await streakRepo.encontrarUsuario(usuarioId);
  if (!usuario) throw new Error("Usuário não encontrado");
  if (usuario.escudos >= 1) throw new Error("Você já possui um escudo");
  if (usuario.moedas < CUSTO_ESCUDO)
    throw new Error(`Moedas insuficientes. Custo: ${CUSTO_ESCUDO}`);

  await streakRepo.atualizar(usuarioId, {
    moedas: usuario.moedas - CUSTO_ESCUDO,
    escudos: usuario.escudos + 1,
  });

  return { escudos: 1, moedasRestantes: usuario.moedas - CUSTO_ESCUDO };
}
