import * as missaoService from '../services/missao.service.js';

export async function listar(req, res) {
  try {
    const elemento = req.validado?.query?.elemento;
    const missoes = await missaoService.listar(elemento);
    return res.json(missoes);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function encontrarPorId(req, res) {
  try {
    const missao = await missaoService.encontrarPorId(req.params.id);
    return res.json(missao);
  } catch (err) {
    return res.status(404).json({ erro: err.message });
  }
}

export async function enfrentar(req, res) {
  try {
    const { id } = req.validado.params;
    const { cartasUsuarioIds } = req.validado.body;
    const resultado = await missaoService.enfrentar(req.usuario.id, id, cartasUsuarioIds);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}