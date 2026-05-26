import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";

const router = Router();

router.get("/", UsuarioController.listarUsuarios);
router.get("/:id", UsuarioController.listarUsuario);
router.post("/", UsuarioController.createUsuario);
router.put("/:id", UsuarioController.updateUsuario);
router.put("/:id/alterar-senha", UsuarioController.updateSenha);
router.delete("/:id", UsuarioController.deleteUsuario);

export default router;