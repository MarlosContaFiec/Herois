import * as authService from '../services/auth.service.js';

export async function registrar(req, res) {
  try {
    const { nomeUsuario, email, senha } = req.validado.body;
    const resultado = await authService.registrar({ nomeUsuario, email, senha });
    return res.status(201).json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, senha } = req.validado.body;
    const resultado = await authService.login({ email, senha });
    return res.json(resultado);
  } catch (err) {
    return res.status(401).json({ erro: err.message });
  }
}

export async function perfil(req, res) {
  try {
    const resultado = await authService.perfil(req.usuario.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(404).json({ erro: err.message });
  }
}