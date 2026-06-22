import * as bossService from "../services/bossGuilda.service.js";

export async function obterStatus(req, res) {
  try {
    const status = await bossService.obterStatus(req.usuario.id);
    res.json(status);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

export async function atacar(req, res) {
  try {
    const { cartasUsuarioIds } = req.body;
    const resultado = await bossService.atacar(
      req.usuario.id,
      cartasUsuarioIds,
    );
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

export async function distribuirRecompensas(req, res) {
  try {
    const { guildaId } = req.params;
    const resultado = await bossService.distribuirRecompensas(guildaId);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}
