import { Router } from "express";
import { ProdutoController } from "../controllers/ProdutoController.js";
import { authUsuario, permitirCargos } from "../middlewares/authMiddleware.js";

const router = Router();
const produtoController = new ProdutoController();

router.get('/', produtoController.getProdutos);
router.get('/:id', produtoController.getProdutosById);

router.post('/', 
  authUsuario, 
  permitirCargos("gestor"),
  produtoController.createProduto
);

router.put('/:id', 
  authUsuario, 
  permitirCargos("gestor"),
  produtoController.updateProduto
);

router.delete('/:id', 
  authUsuario, 
  permitirCargos("gestor"),
  produtoController.deleteProduto
);

export default router;