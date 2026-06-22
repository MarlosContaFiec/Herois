import * as usuarioRepo from "../repository/usuario.repository.js";
import bcrypt from "bcryptjs";

export async function atualizarPerfil(usuarioId, dados) {
  const usuario = await usuarioRepo.encontrarPorId(usuarioId);
  if (!usuario) throw new Error("Usuário não encontrado");

  const updateData = {};

  if (dados.nomeUsuario && dados.nomeUsuario !== usuario.nomeUsuario) {
    const existe = await usuarioRepo.encontrarPorNome(dados.nomeUsuario);
    if (existe) throw new Error("Nome de usuário já existe");
    updateData.nomeUsuario = dados.nomeUsuario;
  }

  if (dados.email && dados.email !== usuario.email) {
    const existe = await usuarioRepo.encontrarPorEmail(dados.email);
    if (existe) throw new Error("Email já está em uso");
    updateData.email = dados.email;
  }

  if (dados.novaSenha) {
    if (!dados.senhaAtual) throw new Error("Senha atual obrigatória");
    const senhaValida = await bcrypt.compare(
      dados.senhaAtual,
      usuario.senhaHash,
    );
    if (!senhaValida) throw new Error("Senha atual incorreta");
    updateData.senhaHash = await bcrypt.hash(dados.novaSenha, 10);
  }

  if (Object.keys(updateData).length === 0)
    throw new Error("Nenhuma alteração fornecida");

  return usuarioRepo.atualizar(usuarioId, updateData);
}
