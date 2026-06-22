import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import * as colecaoController from "../controllers/colecao.controller.js";

const router = Router();

router.get("/", autenticar, colecaoController.listarColecao);
router.get("/:cartaId/detalhes", autenticar, colecaoController.detalhesCarta);
router.post("/:cartaId", autenticar, colecaoController.adicionarCarta);
router.delete("/:cartaId", autenticar, colecaoController.removerCarta);
router.patch(
  "/:cartaId/favoritar",
  autenticar,
  colecaoController.favoritarCarta,
);

export default router;
