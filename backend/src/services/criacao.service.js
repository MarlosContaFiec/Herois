import * as criacaoRepo from "../repository/criacao.repository.js";
import * as usuarioRepo from "../repository/usuario.repository.js";
import { custoCriacaoCarta, FAIXA_PODER } from "../utils/constantes.js";

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const CUSTO_IMPORTAR = {
  COMUM: 50,
  INCOMUM: 100,
  RARA: 250,
  EPICA: 500,
  LENDARIA: 1500,
};

export const CUSTO_ESCOLHER_PACOTE = 200;

export async function criar(usuarioId, dados) {
  const usuario = await usuarioRepo.encontrarPorId(usuarioId);
  if (!usuario) throw new Error("Usuário não encontrado");
  const criacoesHoje = await criacaoRepo.contagemHoje(usuarioId);
  const custo = custoCriacaoCarta(dados.raridade, criacoesHoje);
  if (usuario.moedas < custo)
    throw new Error(`Moedas insuficientes. Custo: ${custo} moedas`);
  const faixa = FAIXA_PODER[dados.raridade];
  const poder = randInt(faixa.min, faixa.max);
  const carta = await criacaoRepo.criarCarta({
    nome: dados.nome,
    descricao: dados.descricao || null,
    imagem: dados.imagem || null,
    elemento: dados.elemento,
    classe: dados.classe,
    raridade: dados.raridade,
    poder,
    criadaPorJogador: true,
    criadorId: usuarioId,
  });

  await usuarioRepo.atualizar(usuarioId, { moedas: usuario.moedas - custo });

  await criacaoRepo.registrar({
    usuarioId,
    cartaId: carta.id,
    raridade: dados.raridade,
    custoPago: custo,
  });

  return {
    carta,
    custoPago: custo,
    moedasRestantes: usuario.moedas - custo,
    criacoesHoje: criacoesHoje + 1,
  };
}

export async function obterTaxas(usuarioId) {
  const criacoesHoje = await criacaoRepo.contagemHoje(usuarioId);
  const raridades = ["COMUM", "INCOMUM", "RARA", "EPICA", "LENDARIA"];
  const taxas = raridades.map((raridade) => {
    const custo = custoCriacaoCarta(raridade, criacoesHoje);
    return { raridade, custo };
  });
  return { criacoesHoje, taxas };
}
