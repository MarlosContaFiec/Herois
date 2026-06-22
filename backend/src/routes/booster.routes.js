import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import validar from "../middlewares/validar.js";
import * as boosterSchema from "../schemas/booster.schema.js";
import * as boosterController from "../controllers/booster.controller.js";

const router = Router();

router.get("/", boosterController.listar);
router.post(
  "/",
  autenticar,
  validar(boosterSchema.criar),
  boosterController.criar,
);
router.post(
  "/:id/comprar",
  autenticar,
  validar(boosterSchema.comprar),
  boosterController.comprar,
);

export default router;
