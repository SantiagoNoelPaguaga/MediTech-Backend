import TareaModel from '../models/TareaModel.js';

async function getTareas(req, res) {
  try {
    const tareas = await TareaModel.listarTareas();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function postTarea(req, res) {
  try {
    const datos = req.body;
    const nueva = await TareaModel.crearTarea(datos);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function putTarea(req, res) {
  try {
    const { id } = req.params;
    const datos = req.body;
    const actualizada = await TareaModel.actualizarTarea(id, datos);
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteTarea(req, res) {
  try {
    const { id } = req.params;
    const resultado = await TareaModel.eliminarTarea(id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getTareasFiltradas(req, res) {
  try {
    const filtros = req.query;
    const tareas = await TareaModel.filtrarTareas(filtros);
    res.json(tareas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export default {
  getTareas,
  postTarea,
  putTarea,
  deleteTarea,
  getTareasFiltradas
};
