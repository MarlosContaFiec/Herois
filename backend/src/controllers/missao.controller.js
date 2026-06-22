import * as missaoService from "../services/missao.service.js";

export async function listar(req, res) {
  try {
    const { elemento } = req.query;
    const missoes = await missaoService.listar(elemento);
    res.json(missoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function encontrarPorId(req, res) {
  try {
    const missao = await missaoService.encontrarPorId(req.params.id);
    res.json(missao);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
}

export async function pendente(req, res) {
  try {
    const tentativa = await missaoService.tentativaPendente(req.usuario.id);
    res.json(tentativa || null);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function iniciar(req, res) {
  try {
    const { id } = req.params;
    const { cartasUsuarioIds } = req.body;
    const resultado = await missaoService.iniciar(
      req.usuario.id,
      id,
      cartasUsuarioIds,
    );
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

export async function resolver(req, res) {
  try {
    const { tentativaId } = req.params;
    const resultado = await missaoService.resolver(req.usuario.id, tentativaId);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}
