import * as cartaService from '../services/carta.service.js';

export async function criar(req, res) {
  try {
    const carta = await cartaService.criar(req.validado.body);
    return res.status(201).json(carta);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function atualizar(req, res) {
  try {
    const carta = await cartaService.atualizar(req.validado.params.id, req.validado.body);
    return res.json(carta);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function deletar(req, res) {
  try {
    await cartaService.deletar(req.validado.params.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function listar(req, res) {
  try {
    const filtros = req.validado?.query || {};
    const cartas = await cartaService.listar(filtros);
    return res.json(cartas);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function encontrarPorId(req, res) {
  try {
    const carta = await cartaService.encontrarPorId(req.validado.params.id);
    return res.json(carta);
  } catch (err) {
    return res.status(404).json({ erro: err.message });
  }
}