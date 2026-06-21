import * as boosterService from '../services/booster.service.js';

export async function listar(req, res) {
  try {
    const boosters = await boosterService.listar();
    return res.json(boosters);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function criar(req, res) {
  try {
    const booster = await boosterService.criar(req.usuario.id, req.validado.body);
    return res.status(201).json(booster);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function comprar(req, res) {
  try {
    const resultado = await boosterService.comprar(req.usuario.id, req.validado.params.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}