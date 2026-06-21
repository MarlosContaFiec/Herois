import * as missaoDiariaService from '../services/missaoDiaria.service.js';

export async function obterStatus(req, res) {
  try {
    const status = await missaoDiariaService.obterStatus(req.usuario.id);
    return res.json(status);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function enfrentar(req, res) {
  try {
    const { cartasUsuarioIds } = req.validado.body;
    const resultado = await missaoDiariaService.enfrentar(req.usuario.id, cartasUsuarioIds);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}