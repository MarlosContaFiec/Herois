import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import validar from "../middlewares/validar.js";
import * as usuarioSchema from "../schemas/usuario.schema.js";
import * as usuarioController from "../controllers/usuario.controller.js";

const router = Router();

router.put(
  "/perfil",
  autenticar,
  validar(usuarioSchema.atualizarPerfil),
  usuarioController.atualizarPerfil,
);

export default router;
