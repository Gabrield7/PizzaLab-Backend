import { Router } from "express";
import { IngredienteController } from "../controllers/IngredienteController.js";

const router = Router();

router.get('/', IngredienteController.getIngredientes);
router.get('/:id', IngredienteController.getIngredientesById);
router.post('/', IngredienteController.createIngrediente);
router.put('/:id', IngredienteController.updateIngrediente);
router.delete('/:id', IngredienteController.deleteIngrediente);

export default router;