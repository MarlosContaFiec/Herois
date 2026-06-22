import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import validar from "../middlewares/validar.js";
import * as bossSchema from "../schemas/bossGuilda.schema.js";
import * as bossController from "../controllers/bossGuilda.controller.js";

const router = Router();

router.get("/status", autenticar, bossController.obterStatus);
router.post(
  "/atacar",
  autenticar,
  validar(bossSchema.atacar),
  bossController.atacar,
);
router.post(
  "/:guildaId/recompensas",
  autenticar,
  bossController.distribuirRecompensas,
);

// somente para testes, remover depois
router.post(
  "/testar-reset/:guildaId",
  autenticar,
  bossController.distribuirRecompensas,
);

export default router;
