import EmpleadoModel from '../models/EmpleadoModel.js';
import AreaModel from '../models/AreaModel.js';
import RolModel from '../models/RolModel.js';

async function mostrarEmpleados(req, res) {
  try {
    const empleados = await EmpleadoModel.obtenerEmpleados();
    res.render('empleados/empleados', { 
      titulo: 'Lista de Empleados', 
      empleados: empleados || [] 
    });
  } catch (error) {
    res.render('empleados/empleados', { 
      titulo: 'Lista de Empleados', 
      empleados: [], 
      mensajeError: error.message 
    });
  }
}

async function formularioNuevoEmpleado(req, res) {
  try {
    const areas = await AreaModel.obtenerAreas();
    const roles = await RolModel.obtenerRoles();
    res.render('empleados/nuevoEmpleado', { 
      titulo: 'Nuevo Empleado', 
      areas, 
      roles 
    });
  } catch (error) {
    res.render('empleados/nuevoEmpleado', { 
      titulo: 'Nuevo Empleado', 
      areas: [], 
      roles: [], 
      mensajeError: error.message 
    });
  }
}

async function guardarEmpleado(req, res) {
  try {
    const { nombre, rol, area, dni } = req.body;
    if (!nombre || !rol || !area || !dni) 
      throw new Error('Todos los campos son requeridos');

    await EmpleadoModel.crearEmpleado(nombre, rol, area, dni);
    res.redirect('/empleados');
  } catch (error) {
    const areas = await AreaModel.obtenerAreas();
    const roles = await RolModel.obtenerRoles();
    res.render('empleados/nuevoEmpleado', { 
      titulo: 'Nuevo Empleado', 
      areas, 
      roles, 
      mensajeError: error.message 
    });
  }
}

async function formularioEditarEmpleado(req, res) {
  try {
    const id = parseInt(req.params.id);
    const empleados = await EmpleadoModel.obtenerEmpleados();
    const empleado = empleados.find(e => e.id === id);
    if (!empleado) throw new Error('Empleado no encontrado');

    const areas = await AreaModel.obtenerAreas();
    const roles = await RolModel.obtenerRoles();
    res.render('empleados/editarEmpleado', { 
      titulo: 'Editar Empleado', 
      empleado, 
      areas, 
      roles 
    });
  } catch (error) {
    res.render('empleados/editarEmpleado', { 
      titulo: 'Editar Empleado', 
      empleado: {}, 
      areas: [], 
      roles: [], 
      mensajeError: error.message 
    });
  }
}

async function actualizarEmpleado(req, res) {
  try {
    const { id } = req.params;
    const { nombre, rol, area, dni } = req.body;
    await EmpleadoModel.actualizarEmpleado(id, nombre, rol, area, dni);
    res.redirect('/empleados');
  } catch (error) {
    const areas = await AreaModel.obtenerAreas();
    const roles = await RolModel.obtenerRoles();
    const empleados = await EmpleadoModel.obtenerEmpleados();
    const empleado = empleados.find(e => e.id === parseInt(req.params.id)) || {};
    res.render('empleados/editarEmpleado', { 
      titulo: 'Editar Empleado', 
      empleado, 
      areas, 
      roles, 
      mensajeError: error.message 
    });
  }
}

async function eliminarEmpleado(req, res) {
  try {
    const id = parseInt(req.params.id);
    await EmpleadoModel.eliminarEmpleado(id);
    res.redirect('/empleados');
  } catch (error) {
    const empleados = await EmpleadoModel.obtenerEmpleados();
    res.render('empleados/empleados', { 
      titulo: 'Lista de Empleados', 
      empleados, 
      mensajeError: error.message 
    });
  }
}

const empleadoController = {
  mostrarEmpleados,
  formularioNuevoEmpleado,
  guardarEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  formularioEditarEmpleado
};

export default empleadoController;
