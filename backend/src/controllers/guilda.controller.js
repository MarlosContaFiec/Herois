import * as guildaService from '../services/guilda.service.js';

export async function criar(req, res) {
  try {
    const resultado = await guildaService.criar(req.usuario.id, req.validado.body);
    return res.status(201).json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function listarTodas(req, res) {
  try {
    const guildas = await guildaService.listarTodas();
    return res.json(guildas);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function encontrarPorId(req, res) {
  try {
    const guilda = await guildaService.encontrarPorId(req.params.id);
    return res.json(guilda);
  } catch (err) {
    return res.status(404).json({ erro: err.message });
  }
}

export async function entrar(req, res) {
  try {
    const resultado = await guildaService.entrar(req.usuario.id, req.validado.params.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function sair(req, res) {
  try {
    const resultado = await guildaService.sair(req.usuario.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function listarPedidos(req, res) {
  try {
    const pedidos = await guildaService.listarPedidos(req.usuario.id, req.params.id);
    return res.json(pedidos);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function responderPedido(req, res) {
  try {
    const { pedidoId, aceitar } = req.validado.body;
    const resultado = await guildaService.responderPedido(req.usuario.id, req.validado.params.id, pedidoId, aceitar);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function convidar(req, res) {
  try {
    const { usuarioId } = req.validado.body;
    const resultado = await guildaService.convidar(req.usuario.id, req.validado.params.id, usuarioId);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function expulsar(req, res) {
  try {
    const { usuarioId } = req.validado.body;
    const resultado = await guildaService.expulsar(req.usuario.id, req.validado.params.id, usuarioId);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function promover(req, res) {
  try {
    const { usuarioId, papel } = req.validado.body;
    const resultado = await guildaService.promover(req.usuario.id, req.validado.params.id, usuarioId, papel);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function agendarTroca(req, res) {
  try {
    const { horarioFixo, manual } = req.validado.body;
    const resultado = await guildaService.agendarTroca(req.usuario.id, req.validado.params.id, horarioFixo, manual);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

export async function deletar(req, res) {
  try {
    const resultado = await guildaService.deletar(req.usuario.id);
    return res.json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}