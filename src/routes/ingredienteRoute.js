import { Router } from "express";
import { IngredienteController } from "../controllers/IngredienteController.js";
import { authUsuario, permitirCargos } from "../middlewares/authMiddleware.js";

const router = Router();
const ingredienteController = new IngredienteController();

router.get('/', 
  authUsuario,
  permitirCargos("gestor", "pizzaiolo"),
  ingredienteController.getIngredientes
);

router.get('/:id', 
  authUsuario,
  permitirCargos("gestor", "pizzaiolo"),
  ingredienteController.getIngredientesById
);

router.post('/', 
  authUsuario,
  permitirCargos("gestor"),
  ingredienteController.createIngrediente
);

router.put('/:id', 
  authUsuario,
  permitirCargos("gestor"),
  ingredienteController.updateIngrediente
);

router.delete('/:id', 
  authUsuario,
  permitirCargos("gestor"),
  ingredienteController.deleteIngrediente
);

export default router;