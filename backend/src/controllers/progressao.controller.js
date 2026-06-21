import * as progressaoService from '../services/progressao.service.js';

export async function obterProgressao(req, res) {
  try {
    const progressao = await progressaoService.obterProgressao(req.usuario.id);
    return res.json(progressao);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function verificarDesbloqueios(req, res) {
  try {
    const desbloqueios = await progressaoService.verificarDesbloqueios(req.usuario.id);
    return res.json(desbloqueios);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}