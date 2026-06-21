import { Router } from 'express';
import autenticar from '../middlewares/autenticar.js';
import validar from '../middlewares/validar.js';
import * as missaoSchema from '../schemas/missao.schema.js';
import * as missaoController from '../controllers/missao.controller.js';

const router = Router();

router.get('/', autenticar, validar(missaoSchema.listar), missaoController.listar);
router.get('/:id', autenticar, missaoController.encontrarPorId);
router.post('/:id/enfrentar', autenticar, validar(missaoSchema.enfrentar), missaoController.enfrentar);

export default router;