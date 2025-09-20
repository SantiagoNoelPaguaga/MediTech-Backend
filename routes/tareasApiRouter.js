import express from 'express';
import tareaApiController from '../controllers/tareaApiController.js';

const router = express.Router();

router.get('/', tareaApiController.getTareas);
router.post('/', tareaApiController.postTarea);
router.put('/:id', tareaApiController.putTarea);
router.delete('/:id', tareaApiController.deleteTarea);
router.get('/filtrar', tareaApiController.getTareasFiltradas);

export default router;