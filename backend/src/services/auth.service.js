import bcrypt from 'bcryptjs';
import * as usuarioRepo from '../repository/usuario.repository.js';
import { gerarToken } from '../utils/jwt.js';

export async function registrar({ nomeUsuario, email, senha }) {
  const emailExistente = await usuarioRepo.encontrarPorEmail(email);
  if (emailExistente) throw new Error('Email já cadastrado');

  const nomeExistente = await usuarioRepo.encontrarPorNomeUsuario(nomeUsuario);
  if (nomeExistente) throw new Error('Nome de usuário já cadastrado');

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await usuarioRepo.criar({ nomeUsuario, email, senhaHash });

  const token = gerarToken({ id: usuario.id, papel: usuario.papel });

  return {
    usuario: {
      id: usuario.id,
      nomeUsuario: usuario.nomeUsuario,
      email: usuario.email,
      papel: usuario.papel,
      moedas: usuario.moedas,
    },
    token,
  };
}

export async function login({ email, senha }) {
  const usuario = await usuarioRepo.encontrarPorEmail(email);
  if (!usuario) throw new Error('Credenciais inválidas');

  const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
  if (!senhaValida) throw new Error('Credenciais inválidas');

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  let novaSequencia = usuario.sequenciaLogin;
  let escudosAtualizados = usuario.escudos;

  if (usuario.ultimoLogin) {
    const ultimo = new Date(usuario.ultimoLogin);
    ultimo.setHours(0, 0, 0, 0);
    const diffDias = Math.floor((hoje - ultimo) / (1000 * 60 * 60 * 24));

    if (diffDias === 1) {
      novaSequencia += 1;
    } else if (diffDias === 2 && usuario.escudos > 0) {
      escudosAtualizados = usuario.escudos - 1;
    } else if (diffDias > 1) {
      novaSequencia = 1;
    }
  } else {
    novaSequencia = 1;
  }

  await usuarioRepo.atualizar(usuario.id, {
    sequenciaLogin: novaSequencia,
    ultimoLogin: new Date(),
    escudos: escudosAtualizados,
  });

  const token = gerarToken({ id: usuario.id, papel: usuario.papel });

  return {
    usuario: {
      id: usuario.id,
      nomeUsuario: usuario.nomeUsuario,
      email: usuario.email,
      papel: usuario.papel,
      moedas: usuario.moedas,
      nivel: usuario.nivel,
      experiencia: usuario.experiencia,
      sequenciaLogin: novaSequencia,
      escudos: escudosAtualizados,
    },
    token,
  };
}

export async function perfil(usuarioId) {
  const usuario = await usuarioRepo.encontrarPorId(usuarioId);
  if (!usuario) throw new Error('Usuário não encontrado');

  const { senhaHash, ...dados } = usuario;
  return dados;
}