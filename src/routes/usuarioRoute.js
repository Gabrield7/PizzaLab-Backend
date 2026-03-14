import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";

const router = Router();

router.get("/", UsuarioController.listarUsuarios);
router.get("/:id", UsuarioController.listarUsuario);

export default router;