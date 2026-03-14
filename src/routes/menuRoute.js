import { Router } from "express";
import { listarMenu } from "../controllers/menuController.js";

const router = Router();

router.get("/", listarMenu);
router.get("/:tipo", listarMenu);

export default router;