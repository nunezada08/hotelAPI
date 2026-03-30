import express from 'express';
import * as controller from '../controllers/quartoController.js';
import { upload } from '../utils/fotoHelper.js';

const router = express.Router();

// Quartos Foto routes
router.post('/:id/foto', upload.single('foto'), controller.uploadFoto);
router.get('/:id/foto', controller.buscarPorId);

// Quartos routes
router.post('/', controller.criar);
router.get('/', controller.buscarTodos);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

export default router;
