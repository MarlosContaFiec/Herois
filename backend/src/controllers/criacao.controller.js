import * as criacaoService from "../services/criacao.service.js";

export async function criar(req, res) {
  try {
    const resultado = await criacaoService.criar(
      req.usuario.id,
      req.validado.body,
    );
    return res.status(201).json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function obterTaxas(req, res) {
  try {
    const resultado = await criacaoService.obterTaxas(req.usuario.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}
