import { Router } from 'express';
import autenticar from '../middlewares/autenticar.js';
import validar from '../middlewares/validar.js';
import * as guildaSchema from '../schemas/guilda.schema.js';
import * as guildaController from '../controllers/guilda.controller.js';

const router = Router();

router.get('/', autenticar, guildaController.listarTodas);
router.get('/:id', autenticar, guildaController.encontrarPorId);
router.post('/', autenticar, validar(guildaSchema.criar), guildaController.criar);
router.delete('/', autenticar, guildaController.deletar);

router.post('/:id/entrar', autenticar, validar(guildaSchema.entrar), guildaController.entrar);
router.post('/sair', autenticar, guildaController.sair);

router.get('/:id/pedidos', autenticar, guildaController.listarPedidos);
router.post('/:id/pedidos', autenticar, validar(guildaSchema.responderPedido), guildaController.responderPedido);

router.post('/:id/convite', autenticar, validar(guildaSchema.convidar), guildaController.convidar);
router.post('/:id/expulsar', autenticar, validar(guildaSchema.expulsar), guildaController.expulsar);
router.put('/:id/promover', autenticar, validar(guildaSchema.promover), guildaController.promover);
router.put('/:id/agenda-troca', autenticar, validar(guildaSchema.agendar), guildaController.agendarTroca);

export default router;