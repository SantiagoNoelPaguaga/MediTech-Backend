import EmpleadoModel from '../models/EmpleadoModel.js';

async function getEmpleados(req, res) {
  try {
    const empleados = await EmpleadoModel.obtenerEmpleados();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function postEmpleado(req, res) {
  try {
    const { nombre, rol, area, dni } = req.body;
    const nuevo = await EmpleadoModel.crearEmpleado(nombre, rol, area, dni);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function putEmpleado(req, res) {
  try {
    const { id } = req.params;
    const { nombre, rol, area, dni } = req.body;
    const actualizado = await EmpleadoModel.actualizarEmpleado(id, nombre, rol, area, dni);
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteEmpleado(req, res) {
  try {
    const { id } = req.params;
    const resultado = await EmpleadoModel.eliminarEmpleado(id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export default {
  getEmpleados,
  postEmpleado,
  putEmpleado,
  deleteEmpleado
};
