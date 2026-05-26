import { Router } from "express";
import { ProdutoController } from "../controllers/ProdutoController.js";

const router = Router();

router.get("/produtos", ProdutoController.getProdutos);
router.get("/produtos/:tipo", ProdutoController.getProdutos);

export default router;