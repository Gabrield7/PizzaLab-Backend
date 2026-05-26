import { Router } from 'express';
import ClienteController from '../controllers/ClienteController.js';

const router = Router();

router.get('/', ClienteController.buscarPorTelefone);
router.patch('/enderecos/:id/desativar', ClienteController.desativarEndereco);

export default router;