import { Router } from "express";
import { PedidosController } from "../controllers/PedidosController.js";

const router = Router();

router.get("/", PedidosController.listarPedidos);
router.get("/:id", PedidosController.listarPedido);
router.post("/", PedidosController.criarPedido);

export default router;