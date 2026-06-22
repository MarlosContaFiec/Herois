import * as labRepo from "../repository/laboratorio.repository.js";
import * as cartaRepo from "../repository/carta.repository.js";
import * as usuarioRepo from "../repository/usuario.repository.js";

const CUSTO_TRANSFERENCIA = {
  COMUM: 50,
  INCOMUM: 250,
  RARA: 1000,
  EPICA: 4000,
  LENDARIA: 15000,
  UNICA: 0,
};

export async function listar(usuarioId) {
  return labRepo.listarPorUsuario(usuarioId);
}

export async function criar(usuarioId, dados) {
  return labRepo.criar({ ...dados, usuarioId });
}

export async function remover(usuarioId, id) {
  const carta = await labRepo.encontrarPorId(id);
  if (!carta) throw new Error("Carta do laboratório não encontrada");
  if (carta.usuarioId !== usuarioId)
    throw new Error("Esta carta não pertence a você");
  return labRepo.deletar(id);
}

export async function transferir(usuarioId, labId) {
  const carta = await labRepo.encontrarPorId(labId);
  if (!carta) throw new Error("Carta do laboratório não encontrada");
  if (carta.usuarioId !== usuarioId)
    throw new Error("Esta carta não pertence a você");
  const custo = CUSTO_TRANSFERENCIA[carta.raridade] || 0;
  const usuario = await usuarioRepo.encontrarPorId(usuarioId);
  if (usuario.moedas < custo)
    throw new Error(`Moedas insuficientes. Custo: ${custo} moedas`);
  const cartaCriada = await cartaRepo.criar({
    nome: carta.nome,
    descricao: carta.descricao,
    imagem: carta.imagem,
    elemento: carta.elemento,
    classe: carta.classe,
    raridade: carta.raridade,
    poder: carta.poder,
    criadaPorJogador: true,
    criadorId: usuarioId,
  });
  await usuarioRepo.atualizar(usuarioId, { moedas: usuario.moedas - custo });
  await labRepo.deletar(labId);
  return {
    carta: cartaCriada,
    custoPago: custo,
    moedasRestantes: usuario.moedas - custo,
  };
}
