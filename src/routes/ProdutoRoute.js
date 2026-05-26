import { Router } from "express";
import { ProdutoController } from "../controllers/ProdutoController.js";

const router = Router();

router.get('/', ProdutoController.getProdutos);
router.get('/:id', ProdutoController.getProdutosById);
router.post('', ProdutoController.createProduto);
router.put('/:id', ProdutoController.updateProduto);
router.delete('/:id', ProdutoController.deleteProduto);

export default router;