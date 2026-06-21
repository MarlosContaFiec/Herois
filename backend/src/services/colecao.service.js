import * as colecaoRepo from '../repository/colecao.repository.js';
import * as cartaRepo from '../repository/carta.repository.js';

export const listarColecao = (usuarioId) => colecaoRepo.listarColecao(usuarioId);

export async function adicionarCarta(usuarioId, cartaId) {
  const carta = await cartaRepo.encontrarPorId(cartaId);
  if (!carta) throw new Error('Carta não encontrada no catálogo');

  const jaPossui = await colecaoRepo.encontrarCartaUsuario(usuarioId, cartaId);
  if (jaPossui) throw new Error('Você já possui esta carta na coleção');

  return colecaoRepo.adicionarCarta(usuarioId, cartaId);
}

export async function removerCarta(usuarioId, cartaId) {
  const cartaUsuario = await colecaoRepo.encontrarCartaUsuario(usuarioId, cartaId);
  if (!cartaUsuario) throw new Error('Você não possui esta carta na coleção');

  return colecaoRepo.removerCarta(usuarioId, cartaId);
}