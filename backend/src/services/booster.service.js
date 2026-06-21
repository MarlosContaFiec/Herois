import * as boosterRepo from '../repository/booster.repository.js';
import * as pacoteRepo from '../repository/pacote.repository.js';
import * as usuarioRepo from '../repository/usuario.repository.js';
import { custoBooster } from '../utils/constantes.js';

const XP_DUPLICATA = {
  COMUM: 5, INCOMUM: 15, RARA: 40, EPICA: 100, LENDARIA: 250,
};

function sortearRaridade(pesos) {
  const entradas = Object.entries(pesos);
  const total = entradas.reduce((s, [, v]) => s + v, 0);
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
  return boosterRepo.listarTodos();
}

export async function criar(usuarioId, dados) {
  const { nome, qtdCartas, pesoComum, pesoIncomum, pesoRara, pesoEpica, pesoLendaria } = dados;

  const soma = pesoComum + pesoIncomum + pesoRara + pesoEpica + pesoLendaria;
  if (Math.abs(soma - 100) > 0.01) throw new Error('A soma dos pesos deve ser 100');

  const custo = custoBooster(qtdCartas, pesoComum, pesoIncomum, pesoRara, pesoEpica, pesoLendaria);

  return boosterRepo.criar({
    nome,
    custo,
    qtdCartas,
    pesoComum,
    pesoIncomum,
    pesoRara,
    pesoEpica,
    pesoLendaria,
    criadorId: usuarioId,
  });
}

export async function comprar(usuarioId, boosterId) {
  const usuario = await usuarioRepo.encontrarPorId(usuarioId);
  if (!usuario) throw new Error('Usuário não encontrado');
  const booster = await boosterRepo.encontrarPorId(boosterId);
  if (!booster) throw new Error('Booster não encontrado');
  if (usuario.moedas < booster.custo) throw new Error('Moedas insuficientes');
  
  const pesos = {
    COMUM: booster.pesoComum,
    INCOMUM: booster.pesoIncomum,
    RARA: booster.pesoRara,
    EPICA: booster.pesoEpica,
    LENDARIA: booster.pesoLendaria,
  };
  const cartasRecebidas = [];
  for (let i = 0; i < booster.qtdCartas; i++) {
    const raridade = sortearRaridade(pesos);
    const disponiveis = await pacoteRepo.listarCartasPorRaridade(raridade);
    if (disponiveis.length === 0) continue;
    const sorteada = escolherCartaAleatoria(disponiveis);
    const existente = await pacoteRepo.encontrarCartaUsuario(usuarioId, sorteada.id);
    if (existente) {
      const xpGanho = XP_DUPLICATA[raridade] || 5;
      await pacoteRepo.atualizarCartaUsuario(existente.id, { xp: existente.xp + xpGanho });
      cartasRecebidas.push({ tipo: 'DUPLICATA', carta: sorteada, xpGanho });
    } else {
      await pacoteRepo.criarCartaUsuario({ usuarioId, cartaId: sorteada.id });
      cartasRecebidas.push({ tipo: 'NOVA', carta: sorteada });
    }
  }
  await usuarioRepo.atualizar(usuarioId, { moedas: usuario.moedas - booster.custo });
  return { cartasRecebidas, moedasRestantes: usuario.moedas - booster.custo };
}