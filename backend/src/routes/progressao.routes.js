import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import * as progressaoController from "../controllers/progressao.controller.js";

const router = Router();

router.get("/", autenticar, progressaoController.obterProgressao);
router.get(
  "/desbloqueios",
  autenticar,
  progressaoController.verificarDesbloqueios,
);

export default router;
