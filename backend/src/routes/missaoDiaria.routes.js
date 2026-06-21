import { Router } from 'express';
import autenticar from '../middlewares/autenticar.js';
import validar from '../middlewares/validar.js';
import * as missaoDiariaSchema from '../schemas/missaoDiaria.schema.js';
import * as missaoDiariaController from '../controllers/missaoDiaria.controller.js';

const router = Router();

router.get('/status', autenticar, missaoDiariaController.obterStatus);
router.post('/enfrentar', autenticar, validar(missaoDiariaSchema.enfrentar), missaoDiariaController.enfrentar);

export default router;