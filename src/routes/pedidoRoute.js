import { Router } from "express";
import { PedidosController } from "../controllers/PedidoController.js";
import { authUsuario } from "../middlewares/authMiddleware.js";

const router = Router();
const pedidosController = new PedidosController();

router.post("/", pedidosController.createPedido);
router.get('/painel', authUsuario, pedidosController.getPedidosParaPainel);

router.patch('/:id/status', 
  authUsuario,
  permitirCargos("gestor", "pizzaiolo", "entregador"), 
  pedidosController.atualizarStatus
);

export default router;