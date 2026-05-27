import { Router } from "express";
import { PedidosController } from "../controllers/PedidosController.js";

const router = Router();

router.post("/", PedidosController.createPedido);

export default router;