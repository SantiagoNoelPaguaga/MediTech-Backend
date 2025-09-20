import express from 'express';
import empleadoController from '../controllers/empleadoController.js';

const router = express.Router();

router.get('/', empleadoController.mostrarEmpleados);
router.get('/nuevo', empleadoController.formularioNuevoEmpleado);
router.post('/nuevo', empleadoController.guardarEmpleado);
router.get('/editar/:id', empleadoController.formularioEditarEmpleado);
router.post('/actualizar/:id', empleadoController.actualizarEmpleado);
router.delete('/eliminar/:id', empleadoController.eliminarEmpleado);

export default router;
