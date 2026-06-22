import * as rankingService from "../services/rankingSemanal.service.js";

export async function obterRanking(req, res) {
  try {
    const ranking = await rankingService.obterRanking();
    return res.json(ranking);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function obterMinhasEstatisticas(req, res) {
  try {
    const stats = await rankingService.obterMinhasEstatisticas(req.usuario.id);
    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}
