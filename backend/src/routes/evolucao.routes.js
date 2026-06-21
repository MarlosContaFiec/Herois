import { Router } from 'express';
import autenticar from '../middlewares/autenticar.js';
import validar from '../middlewares/validar.js';
import * as evolucaoSchema from '../schemas/evolucao.schema.js';
import * as evolucaoController from '../controllers/evolucao.controller.js';

const router = Router();

router.post('/:cartaUsuarioId/evoluir', autenticar, validar(evolucaoSchema.evoluir), evolucaoController.evoluir);

export default router;