import * as tituloService from '../services/titulo.service.js';

export async function listarTodos(req, res) {
  try {
    const titulos = await tituloService.listarTodos();
    return res.json(titulos);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function listarDoUsuario(req, res) {
  try {
    const titulos = await tituloService.listarDoUsuario(req.usuario.id);
    return res.json(titulos);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function equipar(req, res) {
  try {
    const resultado = await tituloService.equipar(req.usuario.id, req.validado.params.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function desequipar(req, res) {
  try {
    const resultado = await tituloService.desequipar(req.usuario.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}