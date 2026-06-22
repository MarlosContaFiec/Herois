import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import exigirPapel from "../middlewares/exigirPapel.js";
import validar from "../middlewares/validar.js";
import * as cartaSchema from "../schemas/carta.schema.js";
import * as cartaController from "../controllers/carta.controller.js";

const router = Router();

router.get("/", validar(cartaSchema.listar), cartaController.listar);
router.get("/:id", validar(cartaSchema.porId), cartaController.encontrarPorId);

router.post("/", validar(cartaSchema.criar), cartaController.criar);
router.put("/:id", validar(cartaSchema.atualizar), cartaController.atualizar);
router.delete("/:id", validar(cartaSchema.porId), cartaController.deletar);

export default router;
