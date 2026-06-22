import * as guildaRepo from "../repository/guilda.repository.js";
import * as usuarioRepo from "../repository/usuario.repository.js";

export async function criar(criadorId, dados) {
  const usuario = await usuarioRepo.encontrarPorId(criadorId);
  if (!usuario) throw new Error("Usuário não encontrado");
  if (usuario.moedas < 1000)
    throw new Error("Moedas insuficientes. Custo: 1000");

  const membroExistente = await guildaRepo.encontrarMembro(criadorId);
  if (membroExistente) throw new Error("Você já pertence a uma guilda");

  const nomeExistente = await guildaRepo.encontrarPorNome(dados.nome);
  if (nomeExistente) throw new Error("Nome de guilda já existe");

  const guilda = await guildaRepo.criar({
    nome: dados.nome,
    descricao: dados.descricao || null,
    tipoEntrada: dados.tipoEntrada || "AUTOMATICO",
    custoCriacao: 1000,
    criadorId,
  });

  await guildaRepo.criarMembro({
    guildaId: guilda.id,
    usuarioId: criadorId,
    papel: "LIDER",
  });

  await usuarioRepo.atualizar(criadorId, { moedas: usuario.moedas - 1000 });

  return guilda;
}

export async function listarTodas() {
  return guildaRepo.listarTodas();
}

export async function encontrarPorId(id) {
  const guilda = await guildaRepo.encontrarPorId(id);
  if (!guilda) throw new Error("Guilda não encontrada");
  return guilda;
}

export async function entrar(usuarioId, guildaId) {
  const membroExistente = await guildaRepo.encontrarMembro(usuarioId);
  if (membroExistente) throw new Error("Você já pertence a uma guilda");

  const guilda = await guildaRepo.encontrarPorId(guildaId);
  if (!guilda) throw new Error("Guilda não encontrada");

  if (guilda.tipoEntrada === "AUTOMATICO") {
    await guildaRepo.criarMembro({ guildaId, usuarioId, papel: "MEMBRO" });
    return { status: "ENTROU", guilda };
  }

  if (guilda.tipoEntrada === "PEDIDO") {
    const pedidoExistente = await guildaRepo.encontrarPedido(
      guildaId,
      usuarioId,
    );
    if (pedidoExistente && pedidoExistente.status === "PENDENTE") {
      throw new Error("Você já tem um pedido pendente");
    }
    const pedido = await guildaRepo.criarPedido({ guildaId, usuarioId });
    return { status: "PEDIDO_ENVIADO", pedido };
  }

  throw new Error("Esta guilda só aceita convites");
}

export async function sair(usuarioId) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro) throw new Error("Você não pertence a uma guilda");
  if (membro.papel === "LIDER")
    throw new Error("O líder não pode sair. Transfira a liderança primeiro");
  await guildaRepo.removerMembro(usuarioId);
  return { status: "SAIU" };
}

export async function listarPedidos(usuarioId, guildaId) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== guildaId)
    throw new Error("Você não pertence a esta guilda");
  if (membro.papel === "MEMBRO")
    throw new Error("Apenas líder e vice podem ver pedidos");
  return guildaRepo.listarPedidos(guildaId);
}

export async function responderPedido(usuarioId, guildaId, pedidoId, aceitar) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== guildaId)
    throw new Error("Você não pertence a esta guilda");
  if (membro.papel === "MEMBRO")
    throw new Error("Apenas líder e vice podem responder pedidos");

  const pedido = await guildaRepo.encontrarPedidoPorId(pedidoId);
  if (!pedido || pedido.guildaId !== guildaId)
    throw new Error("Pedido não encontrado");
  if (pedido.status !== "PENDENTE") throw new Error("Pedido já foi processado");

  if (aceitar) {
    await guildaRepo.criarMembro({
      guildaId,
      usuarioId: pedido.usuarioId,
      papel: "MEMBRO",
    });
    await guildaRepo.atualizarPedido(pedidoId, { status: "ACEITO" });
    return { status: "ACEITO", usuario: pedido.usuario };
  }

  await guildaRepo.atualizarPedido(pedidoId, { status: "REJEITADO" });
  return { status: "REJEITADO" };
}

export async function convidar(usuarioId, guildaId, usuarioConvidadoId) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== guildaId)
    throw new Error("Você não pertence a esta guilda");
  if (membro.papel === "MEMBRO")
    throw new Error("Apenas líder e vice podem convidar");

  const jaMembro = await guildaRepo.encontrarMembro(usuarioConvidadoId);
  if (jaMembro) throw new Error("Este jogador já pertence a uma guilda");

  await guildaRepo.criarMembro({
    guildaId,
    usuarioId: usuarioConvidadoId,
    papel: "MEMBRO",
  });
  return { status: "CONVIDADO" };
}

export async function expulsar(usuarioId, guildaId, usuarioExpulsoId) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== guildaId)
    throw new Error("Você não pertence a esta guilda");
  if (membro.papel === "MEMBRO")
    throw new Error("Apenas líder e vice podem expulsar");

  const alvo = await guildaRepo.encontrarMembro(usuarioExpulsoId);
  if (!alvo || alvo.guildaId !== guildaId)
    throw new Error("Jogador não pertence a esta guilda");
  if (alvo.papel === "LIDER")
    throw new Error("Não é possível expulsar o líder");

  if (membro.papel === "VICE" && alvo.papel === "VICE") {
    throw new Error("Vice não pode expulsar outro vice");
  }

  await guildaRepo.removerMembro(usuarioExpulsoId);
  return { status: "EXPULSO" };
}

export async function promover(usuarioId, guildaId, alvoId, novoPapel) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== guildaId)
    throw new Error("Você não pertence a esta guilda");
  if (membro.papel !== "LIDER")
    throw new Error("Apenas o líder pode promover/rebaixar");

  const alvo = await guildaRepo.encontrarMembro(alvoId);
  if (!alvo || alvo.guildaId !== guildaId)
    throw new Error("Jogador não pertence a esta guilda");

  if (novoPapel === "VICE") {
    const vicesAtuais = await guildaRepo.contarMembros(guildaId);
    const membros = await guildaRepo.encontrarPorId(guildaId);
    const qtdVices = membros.membros.filter((m) => m.papel === "VICE").length;
    if (qtdVices >= 2) throw new Error("Máximo de 2 vices atingido");
  }

  await guildaRepo.atualizarMembro(alvoId, { papel: novoPapel });
  return { status: "PROMOVIDO", novoPapel };
}

export async function agendarTroca(usuarioId, guildaId, horarioFixo, manual) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro || membro.guildaId !== guildaId)
    throw new Error("Você não pertence a esta guilda");

  const guilda = await guildaRepo.encontrarPorId(guildaId);

  if (membro.papel === "LIDER") {
    if (horarioFixo) {
      await guildaRepo.atualizarGuilda(guildaId, {
        tipoAgendaTroca: "FIXO",
        horarioFixoTroca: horarioFixo,
        ultimoAgendadorId: usuarioId,
        ultimoAgendamento: new Date(),
      });
      return { status: "AGENDADO", horarioFixo };
    }
    return { status: "MANUAL" };
  }

  if (membro.papel === "VICE") {
    if (
      guilda.ultimoAgendadorId === guilda.criadorId &&
      guilda.ultimoAgendamento
    ) {
      const diffDias = Math.floor(
        (new Date() - new Date(guilda.ultimoAgendamento)) /
          (1000 * 60 * 60 * 24),
      );
      if (diffDias < 3)
        throw new Error(
          "O líder definiu o horário há menos de 3 dias. Não é possível alterar",
        );
    }
    if (horarioFixo) {
      await guildaRepo.atualizarGuilda(guildaId, {
        tipoAgendaTroca: "FIXO",
        horarioFixoTroca: horarioFixo,
        ultimoAgendadorId: usuarioId,
        ultimoAgendamento: new Date(),
      });
      return { status: "AGENDADO", horarioFixo };
    }
    return { status: "MANUAL" };
  }

  throw new Error("Apenas líder e vice podem agendar sessões de troca");
}

export async function deletar(usuarioId) {
  const membro = await guildaRepo.encontrarMembro(usuarioId);
  if (!membro) throw new Error("Você não pertence a uma guilda");
  if (membro.papel !== "LIDER")
    throw new Error("Apenas o líder pode deletar a guilda");

  await guildaRepo.deletar(membro.guildaId);
  return { status: "DELETADA" };
}

export async function minhaGuilda(usuarioId) {
  const membro = await guildaRepo.encontrarMinhaGuilda(usuarioId);
  return membro?.guilda || null;
}
