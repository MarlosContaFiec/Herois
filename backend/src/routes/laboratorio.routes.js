import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import validar from "../middlewares/validar.js";
import * as labSchema from "../schemas/laboratorio.schema.js";
import * as labController from "../controllers/laboratorio.controller.js";

const router = Router();

router.get("/", autenticar, labController.listar);
router.post("/", autenticar, validar(labSchema.criar), labController.criar);
router.delete(
  "/:id",
  autenticar,
  validar(labSchema.remover),
  labController.remover,
);
router.post(
  "/:id/transferir",
  autenticar,
  validar(labSchema.transferir),
  labController.transferir,
);

export default router;
