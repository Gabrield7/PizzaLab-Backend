import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";
import { authUsuario, permitirCargos, verificarPosse } from "../middlewares/authMiddleware.js";

const router = Router();
const usuarioController = new UsuarioController();

router.post('/login', usuarioController.login);

router.get("/", 
  authUsuario, 
  permitirCargos("gestor"), 
  usuarioController.listarUsuarios
);

router.get("/:id", 
  authUsuario, 
  permitirCargos("gestor"), 
  usuarioController.listarUsuario
);

router.post("/", 
  authUsuario, 
  permitirCargos("gestor"), 
  usuarioController.createUsuario
);

router.put("/:id", 
  authUsuario, 
  permitirCargos("gestor", "pizzaiolo", "entregador"), 
  verificarPosse,
  usuarioController.updateUsuario
);

router.put("/:id/alterar-senha", 
  authUsuario, 
  permitirCargos("gestor", "pizzaiolo", "entregador"), 
  verificarPosse,
  usuarioController.updateSenha
);

router.delete("/:id", 
  authUsuario, 
  permitirCargos("gestor"), 
  usuarioController.deleteUsuario
);

export default router;