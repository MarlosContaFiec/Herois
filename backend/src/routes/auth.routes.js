import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import validar from "../middlewares/validar.js";
import * as authSchema from "../schemas/auth.schema.js";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/registrar",
  validar(authSchema.registrar),
  authController.registrar,
);
router.post("/login", validar(authSchema.login), authController.login);
router.get("/me", autenticar, authController.perfil);

export default router;
