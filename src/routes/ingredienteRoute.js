import { Router } from "express";
import { IngredienteController } from "../controllers/IngredienteController.js";

const router = Router();

router.get("/ingredientes", IngredienteController.getIngredientes);
router.get("/ingredientes/:id", IngredienteController.getIngredientesById);
router.post("/ingredientes", IngredienteController.createIngrediente);
router.put("/ingredientes/:id", IngredienteController.updateIngrediente);
router.delete("/ingredientes/:id", IngredienteController.deleteIngrediente);

export default router;