import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import validar from "../middlewares/validar.js";
import * as pacoteSchema from "../schemas/pacote.schema.js";
import * as pacoteController from "../controllers/pacote.controller.js";

const router = Router();

router.get("/", pacoteController.listar);
router.get("/:id", pacoteController.encontrarPorId);

router.post(
  "/:id/comprar",
  autenticar,
  validar(pacoteSchema.comprar),
  pacoteController.comprar,
);
router.get(
  "/:id/pity",
  autenticar,
  validar(pacoteSchema.pity),
  pacoteController.obterPity,
);
router.post(
  "/:id/pity",
  autenticar,
  validar(pacoteSchema.resgatar),
  pacoteController.resgatarPity,
);

export default router;
