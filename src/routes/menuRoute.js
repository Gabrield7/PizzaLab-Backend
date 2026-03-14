import { Router } from "express";
import { MenuController } from "../controllers/MenuController.js";

const router = Router();

router.get("/", MenuController.listarMenu);
router.get("/:tipo", MenuController.listarMenu);

export default router;