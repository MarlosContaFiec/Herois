import * as colecaoService from '../services/colecao.service.js';

export async function listarColecao(req, res) {
  try {
    const colecao = await colecaoService.listarColecao(req.usuario.id);
    return res.json(colecao);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function adicionarCarta(req, res) {
  try {
    const cartaUsuario = await colecaoService.adicionarCarta(req.usuario.id, req.validado.params.cartaId);
    return res.status(201).json(cartaUsuario);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function removerCarta(req, res) {
  try {
    await colecaoService.removerCarta(req.usuario.id, req.validado.params.cartaId);
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}