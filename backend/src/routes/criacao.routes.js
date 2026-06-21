import { Router } from 'express';
import autenticar from '../middlewares/autenticar.js';
import validar from '../middlewares/validar.js';
import * as criacaoSchema from '../schemas/criacao.schema.js';
import * as criacaoController from '../controllers/criacao.controller.js';

const router = Router();

router.get('/taxas', autenticar, criacaoController.obterTaxas);
router.post('/', autenticar, validar(criacaoSchema.criar), criacaoController.criar);

export default router;