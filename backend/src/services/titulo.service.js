import * as tituloRepo from '../repository/titulo.repository.js';
import * as usuarioRepo from '../repository/usuario.repository.js';

export async function listarTodos() {
  return tituloRepo.listarTodos();
}

export async function listarDoUsuario(usuarioId) {
  return tituloRepo.listarDoUsuario(usuarioId);
}

export async function equipar(usuarioId, tituloId) {
  const usuario = await usuarioRepo.encontrarPorId(usuarioId);
  if (!usuario) throw new Error('Usuário não encontrado');

  const titulo = await tituloRepo.encontrarPorId(tituloId);
  if (!titulo) throw new Error('Título não encontrado');

  const possui = await tituloRepo.usuarioTemTitulo(usuarioId, tituloId);
  if (!possui) throw new Error('Você não possui este título');

  await usuarioRepo.atualizar(usuarioId, { tituloAtivoId: tituloId });

  return { tituloAtivo: titulo };
}

export async function desequipar(usuarioId) {
  await usuarioRepo.atualizar(usuarioId, { tituloAtivoId: null });
  return { tituloAtivo: null };
}