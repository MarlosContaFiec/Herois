import { Router } from 'express';
import authRoutes from './auth.routes.js';
import cartaRoutes from './carta.routes.js';
import colecaoRoutes from './colecao.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cartas', cartaRoutes);
router.use('/colecao', colecaoRoutes);

export default router;