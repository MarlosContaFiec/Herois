import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import validar from "../middlewares/validar.js";
import * as streakSchema from "../schemas/streak.schema.js";
import * as streakController from "../controllers/streak.controller.js";

const router = Router();

router.get("/status", autenticar, streakController.obterStatus);
router.post("/resgatar", autenticar, streakController.resgatar);
router.post(
  "/escudo",
  autenticar,
  validar(streakSchema.comprarEscudo),
  streakController.comprarEscudo,
);

export default router;
