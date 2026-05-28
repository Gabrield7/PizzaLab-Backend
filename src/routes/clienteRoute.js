import { Router } from 'express';
import ClienteController from '../controllers/ClienteController.js';

const router = Router();
const clienteController = new ClienteController();

router.post('/enviar-otp', clienteController.enviaCodigoVerificacao);
router.post('/validar-otp', clienteController.validaCodigo);
router.patch('/enderecos/:id/desativar', authUsuario, clienteController.desativarEndereco);

export default router;