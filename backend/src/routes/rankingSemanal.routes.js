import { Router } from 'express';
import autenticar from '../middlewares/autenticar.js';
import * as rankingController from '../controllers/rankingSemanal.controller.js';

const router = Router();

router.get('/', rankingController.obterRanking);
router.get('/me', autenticar, rankingController.obterMinhasEstatisticas);

export default router;