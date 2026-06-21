import * as pacoteService from '../services/pacote.service.js';

export async function listar(req, res) {
  try {
    const pacotes = await pacoteService.listar();
    return res.json(pacotes);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function encontrarPorId(req, res) {
  try {
    const pacote = await pacoteService.encontrarPorId(req.params.id);
    return res.json(pacote);
  } catch (err) {
    return res.status(404).json({ erro: err.message });
  }
}

export async function comprar(req, res) {
  try {
    const resultado = await pacoteService.comprar(req.usuario.id, req.validado.params.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function obterPity(req, res) {
  try {
    const resultado = await pacoteService.obterPity(req.usuario.id, req.validado.params.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function resgatarPity(req, res) {
  try {
    const { id } = req.validado.params;
    const { cartaId } = req.validado.body;
    const resultado = await pacoteService.resgatarPity(req.usuario.id, id, cartaId);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}