import * as evolucaoService from "../services/evolucao.service.js";

export async function evoluir(req, res) {
  try {
    const resultado = await evolucaoService.evoluir(
      req.usuario.id,
      req.validado.params.cartaUsuarioId,
    );
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}
