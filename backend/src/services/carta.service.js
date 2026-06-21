import * as cartaRepo from '../repository/carta.repository.js';
import { FAIXA_PODER } from '../utils/constantes.js';

export async function criar(data) {
  const faixa = FAIXA_PODER[data.raridade];
  if (!faixa) throw new Error('Raridade inválida');
  if (data.poder < faixa.min || data.poder > faixa.max) {
    throw new Error(`Poder para ${data.raridade} deve estar entre ${faixa.min} e ${faixa.max}`);
  }
  return cartaRepo.criar(data);
}

export async function atualizar(id, data) {
  const existente = await cartaRepo.encontrarPorId(id);
  if (!existente) throw new Error('Carta não encontrada');
  const raridade = data.raridade || existente.raridade;
  const poder = data.poder || existente.poder;
  const faixa = FAIXA_PODER[raridade];
  if (poder < faixa.min || poder > faixa.max) {
    throw new Error(`Poder ${poder} incompatível com raridade ${raridade} (${faixa.min}-${faixa.max})`);
  }
  return cartaRepo.atualizar(id, data);
}

export async function deletar(id) {
  const existente = await cartaRepo.encontrarPorId(id);
  if (!existente) throw new Error('Carta não encontrada');
  return cartaRepo.deletar(id);
}

export const listar = (filtros) => cartaRepo.listarTodos(filtros);

export async function encontrarPorId(id) {
  const carta = await cartaRepo.encontrarPorId(id);
  if (!carta) throw new Error('Carta não encontrada');
  return carta;
}