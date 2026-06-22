import * as pacoteRepo from "../repository/pacote.repository.js";
import * as usuarioRepo from "../repository/usuario.repository.js";

const XP_DUPLICATA = {
  COMUM: 5,
  INCOMUM: 15,
  RARA: 40,
  EPICA: 100,
  LENDARIA: 250,
  UNICA: 0,
};

function ajustarPesosPorSorte(pesos, bonusSorte) {
  const total =
    pesos.COMUM + pesos.INCOMUM + pesos.RARA + pesos.EPICA + pesos.LENDARIA;
  const reducaoComum = pesos.COMUM * bonusSorte;
  const comum = Math.max(0, pesos.COMUM - reducaoComum);
  const redistribuicao = reducaoComum / 4;

  return {
    COMUM: comum,
    INCOMUM: pesos.INCOMUM + redistribuicao,
    RARA: pesos.RARA + redistribuicao,
    EPICA: pesos.EPICA + redistribuicao,
    LENDARIA: pesos.LENDARIA + redistribuicao,
  };
}

function sortearRaridade(pesos) {
  const entradas = Object.entries(pesos);
  const total = entradas.reduce((soma, [, v]) => soma + v, 0);
  const aleatorio = Math.random() * total;
  let acumulado = 0;

  for (const [raridade, peso] of entradas) {
    acumulado += peso;
    if (aleatorio <= acumulado) return raridade;
  }

  return entradas[entradas.length - 1][0];
}

function escolherCartaAleatoria(cartas) {
  return cartas[Math.floor(Math.random() * cartas.length)];
}

export async function listar() {
  return pacoteRepo.listarTodos();
}

export async function encontrarPorId(id) {
  const pacote = await pacoteRepo.encontrarPorId(id);
  if (!pacote) throw new Error("Pacote não encontrado");
  return pacote;
}

export async function comprar(usuarioId, pacoteId) {
  const usuario = await usuarioRepo.encontrarPorId(usuarioId);
  if (!usuario) throw new Error("Usuário não encontrado");

  const pacote = await pacoteRepo.encontrarPorId(pacoteId);
  if (!pacote) throw new Error("Pacote não encontrado");

  if (usuario.moedas < pacote.custo) throw new Error("Moedas insuficientes");

  const titulo = await pacoteRepo.encontrarTituloAtivo(usuarioId);
  const bonusSorte = titulo?.tipoBonus === "SORTE" ? titulo.valorBonus : 0;

  let pesos = {
    COMUM: pacote.pesoComum,
    INCOMUM: pacote.pesoIncomum,
    RARA: pacote.pesoRara,
    EPICA: pacote.pesoEpica,
    LENDARIA: pacote.pesoLendaria,
  };

  if (bonusSorte > 0) {
    pesos = ajustarPesosPorSorte(pesos, bonusSorte);
  }

  const cartasRecebidas = [];

  for (let i = 0; i < pacote.qtdCartas; i++) {
    const raridade = sortearRaridade(pesos);
    const cartasDisponiveis =
      await pacoteRepo.listarCartasPorRaridade(raridade);

    if (cartasDisponiveis.length === 0) continue;

    const cartaSorteada = escolherCartaAleatoria(cartasDisponiveis);
    const existente = await pacoteRepo.encontrarCartaUsuario(
      usuarioId,
      cartaSorteada.id,
    );

    if (existente) {
      const xpGanho = XP_DUPLICATA[raridade] || 5;
      await pacoteRepo.atualizarCartaUsuario(existente.id, {
        xp: existente.xp + xpGanho,
      });
      cartasRecebidas.push({
        tipo: "DUPLICATA",
        carta: cartaSorteada,
        xpGanho,
      });
    } else {
      await pacoteRepo.criarCartaUsuario({
        usuarioId,
        cartaId: cartaSorteada.id,
      });
      cartasRecebidas.push({ tipo: "NOVA", carta: cartaSorteada });
    }
  }

  await usuarioRepo.atualizar(usuarioId, {
    moedas: usuario.moedas - pacote.custo,
  });

  await pacoteRepo.criarCompra({
    usuarioId,
    pacoteId,
    cartasRecebidas: JSON.stringify(cartasRecebidas.map((c) => c.carta.id)),
  });

  const aberturas = await pacoteRepo.contarAberturas(usuarioId, pacoteId);

  return {
    cartasRecebidas,
    moedasRestantes: usuario.moedas - pacote.custo,
    aberturas,
    pityRestante: Math.max(0, 100 - aberturas),
  };
}

export async function obterPity(usuarioId, pacoteId) {
  const pacote = await pacoteRepo.encontrarPorId(pacoteId);
  if (!pacote) throw new Error("Pacote não encontrado");

  const aberturas = await pacoteRepo.contarAberturas(usuarioId, pacoteId);
  const resgatavel = aberturas >= 100;

  const todasCartas = await pacoteRepo.listarCartasPorPacote(pacoteId);
  const cartasDisponiveis = todasCartas
    .map((cp) => cp.carta)
    .filter((c) => c.raridade !== "UNICA");

  return {
    aberturas,
    pityRestante: Math.max(0, 100 - aberturas),
    resgatavel,
    cartasDisponiveis,
  };
}

export async function resgatarPity(usuarioId, pacoteId, cartaId) {
  const pacote = await pacoteRepo.encontrarPorId(pacoteId);
  if (!pacote) throw new Error("Pacote não encontrado");

  const aberturas = await pacoteRepo.contarAberturas(usuarioId, pacoteId);
  if (aberturas < 100)
    throw new Error(`Pity insuficiente. Faltam ${100 - aberturas} aberturas`);

  const carta = await pacoteRepo.encontrarCartaPorId(cartaId);
  if (!carta) throw new Error("Carta não encontrada");
  if (carta.raridade === "UNICA")
    throw new Error("Carta única não pode ser resgatada via pity");

  const cartasDoPacote = await pacoteRepo.listarCartasPorPacote(pacoteId);
  const cartaNoPacote = cartasDoPacote.find((cp) => cp.cartaId === cartaId);
  if (!cartaNoPacote) throw new Error("Esta carta não pertence a este pacote");

  const existente = await pacoteRepo.encontrarCartaUsuario(usuarioId, cartaId);
  if (existente) {
    const xpGanho = XP_DUPLICATA[carta.raridade] || 5;
    await pacoteRepo.atualizarCartaUsuario(existente.id, {
      xp: existente.xp + xpGanho,
    });
    return { tipo: "DUPLICATA", carta, xpGanho };
  }

  await pacoteRepo.criarCartaUsuario({ usuarioId, cartaId });
  return { tipo: "NOVA", carta };
}
