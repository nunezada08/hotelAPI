import express from 'express';
import * as controller from '../controllers/quartoController.js';
import { upload } from '../utils/fotoHelper.js';

const router = express.Router();

// Quartos Foto routes
router.post('/:id/foto', upload.single('foto'), controller.uploadFoto);
router.get('/:id/foto', controller.buscarPorId);

// Quartos routes
router.post('/quartos', controller.criar);
router.get('/quartos', controller.buscarTodos);
router.get('/quartos/:id', controller.buscarPorId);
router.put('/quartos/:id', controller.atualizar);
router.delete('/quartos/:id', controller.deletar);

export default router;
