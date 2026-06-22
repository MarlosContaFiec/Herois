import * as usuarioService from "../services/usuario.service.js";

export async function atualizarPerfil(req, res) {
  try {
    const resultado = await usuarioService.atualizarPerfil(
      req.usuario.id,
      req.body,
    );
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}
