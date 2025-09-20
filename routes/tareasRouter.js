import express from 'express';
import tareaController from '../controllers/tareaController.js';

const router = express.Router();

router.get('/', tareaController.mostrarTareas);
router.get('/nueva', tareaController.formularioNuevaTarea);
router.post('/nueva', tareaController.guardarTarea);
router.get('/editar/:id', tareaController.formularioEditarTarea);
router.post('/actualizar/:id', tareaController.actualizarTarea);
router.delete('/eliminar/:id', tareaController.eliminarTarea);
router.get('/filtrar', tareaController.filtrarTareas);

export default router;
