import express from 'express';
import * as controller from '../controllers/hospedeController.js';

const router = express.Router();

router.post('/hospedes', controller.criar);
router.get('/hospedes', controller.buscarTodos);
router.get('/hospedes/:id', controller.buscarPorId);
router.put('/hospedes/:id', controller.atualizar);
router.delete('/hospedes/:id', controller.deletar);

export default router;