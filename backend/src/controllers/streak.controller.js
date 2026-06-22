import * as streakService from "../services/streak.service.js";

export async function obterStatus(req, res) {
  try {
    const status = await streakService.obterStatus(req.usuario.id);
    return res.json(status);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function resgatar(req, res) {
  try {
    const resultado = await streakService.resgatar(req.usuario.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function comprarEscudo(req, res) {
  try {
    const resultado = await streakService.comprarEscudo(req.usuario.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}
