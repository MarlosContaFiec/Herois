import * as sessaoService from '../services/sessaoTroca.service.js';

export async function iniciar(req, res) {
  try {
    const sessao = await sessaoService.iniciar(req.usuario.id, req.validado.params.id);
    return res.status(201).json(sessao);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function obterAtiva(req, res) {
  try {
    const sessao = await sessaoService.obterAtiva(req.params.id);
    return res.json(sessao);
  } catch (err) {
    return res.status(404).json({ erro: err.message });
  }
}

export async function colocarNaVitrine(req, res) {
  try {
    const { cartaUsuarioId, precoPedido } = req.validado.body;
    const listagem = await sessaoService.colocarNaVitrine(
      req.usuario.id,
      req.validado.params.sessaoId,
      cartaUsuarioId,
      precoPedido,
    );
    return res.status(201).json(listagem);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function fazerOferta(req, res) {
  try {
    const oferta = await sessaoService.fazerOferta(
      req.usuario.id,
      req.validado.params.sessaoId,
      req.validado.body,
    );
    return res.status(201).json(oferta);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function responderOferta(req, res) {
  try {
    const { ofertaId, aceitar } = req.validado.body;
    const resultado = await sessaoService.responderOferta(
      req.usuario.id,
      req.validado.params.sessaoId,
      ofertaId,
      aceitar,
    );
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}