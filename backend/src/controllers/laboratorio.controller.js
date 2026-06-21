import * as labService from '../services/laboratorio.service.js';

export async function listar(req, res) {
  try {
    const cartas = await labService.listar(req.usuario.id);
    return res.json(cartas);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function criar(req, res) {
  try {
    const carta = await labService.criar(req.usuario.id, req.validado.body);
    return res.status(201).json(carta);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function remover(req, res) {
  try {
    await labService.remover(req.usuario.id, req.validado.params.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function transferir(req, res) {
  try {
    const resultado = await labService.transferir(req.usuario.id, req.validado.params.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}