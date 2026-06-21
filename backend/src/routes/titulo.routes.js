import { Router } from 'express';
import autenticar from '../middlewares/autenticar.js';
import validar from '../middlewares/validar.js';
import * as tituloSchema from '../schemas/titulo.schema.js';
import * as tituloController from '../controllers/titulo.controller.js';

const router = Router();

router.get('/', tituloController.listarTodos);
router.get('/meus', autenticar, tituloController.listarDoUsuario);
router.put('/:id/equipar', autenticar, validar(tituloSchema.equipar), tituloController.equipar);
router.delete('/equipar', autenticar, tituloController.desequipar);

export default router;