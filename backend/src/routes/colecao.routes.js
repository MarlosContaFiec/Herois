import { Router } from 'express';
import autenticar from '../middlewares/autenticar.js';
import validar from '../middlewares/validar.js';
import * as colecaoSchema from '../schemas/colecao.schema.js';
import * as colecaoController from '../controllers/colecao.controller.js';

const router = Router();

router.get('/', autenticar, colecaoController.listarColecao);
router.post('/:cartaId', autenticar, validar(colecaoSchema.adicionar), colecaoController.adicionarCarta);
router.delete('/:cartaId', autenticar, validar(colecaoSchema.remover), colecaoController.removerCarta);

export default router;