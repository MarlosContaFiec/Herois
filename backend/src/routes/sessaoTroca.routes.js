import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import validar from "../middlewares/validar.js";
import * as sessaoSchema from "../schemas/sessaoTroca.schema.js";
import * as sessaoController from "../controllers/sessaoTroca.controller.js";

const router = Router();

router.post(
  "/:id/iniciar",
  autenticar,
  validar(sessaoSchema.iniciar),
  sessaoController.iniciar,
);
router.get("/:id/ativa", autenticar, sessaoController.obterAtiva);

router.post(
  "/:sessaoId/vitrine",
  autenticar,
  validar(sessaoSchema.colocarNaVitrine),
  sessaoController.colocarNaVitrine,
);
router.post(
  "/:sessaoId/oferta",
  autenticar,
  validar(sessaoSchema.fazerOferta),
  sessaoController.fazerOferta,
);
router.put(
  "/:sessaoId/oferta",
  autenticar,
  validar(sessaoSchema.responderOferta),
  sessaoController.responderOferta,
);

export default router;
