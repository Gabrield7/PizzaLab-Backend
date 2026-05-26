import { Router } from 'express';
import { ReceitaController } from '../controllers/ReceitaController.js';

const router = Router();

router.post('/receitas', ReceitaController.createReceita);
router.put('/receitas/:id', ReceitaController.updateReceita);
router.delete('/receitas/:id', ReceitaController.deleteReceita);