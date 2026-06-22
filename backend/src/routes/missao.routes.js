import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import * as missaoController from "../controllers/missao.controller.js";

const router = Router();

router.get("/", missaoController.listar);
router.get("/pendente", autenticar, missaoController.pendente);
router.get("/:id", missaoController.encontrarPorId);
router.post("/:id/iniciar", autenticar, missaoController.iniciar);
router.post(
  "/tentativa/:tentativaId/resolver",
  autenticar,
  missaoController.resolver,
);

export default router;
