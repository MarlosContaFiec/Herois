import * as colecaoService from "../services/colecao.service.js";

export async function listarColecao(req, res) {
  try {
    const cartas = await colecaoService.listarColecao(req.usuario.id);
    res.json(cartas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function adicionarCarta(req, res) {
  try {
    const { cartaId } = req.params;
    const { pacoteId } = req.body;
    const resultado = await colecaoService.adicionarCarta(
      req.usuario.id,
      cartaId,
      pacoteId,
    );
    res.status(201).json(resultado);
  } catch (err) {
    const status =
      err.message.includes("insuficientes") || err.message.includes("ja possui")
        ? 400
        : 404;
    res.status(status).json({ erro: err.message });
  }
}

export async function removerCarta(req, res) {
  try {
    const { cartaId } = req.params;
    const resultado = await colecaoService.removerCarta(
      req.usuario.id,
      cartaId,
    );
    res.json(resultado);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
}

export async function favoritarCarta(req, res) {
  try {
    const { cartaId } = req.params;
    const resultado = await colecaoService.favoritarCarta(
      req.usuario.id,
      cartaId,
    );
    res.json(resultado);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
}

export async function detalhesCarta(req, res) {
  try {
    const { cartaId } = req.params;
    const resultado = await colecaoService.detalhesCarta(
      req.usuario.id,
      cartaId,
    );
    res.json(resultado);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
}
