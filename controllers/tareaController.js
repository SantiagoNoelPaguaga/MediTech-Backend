import TareaModel from '../models/TareaModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';
import AreaModel from '../models/AreaModel.js';
import TituloTareaModel from '../models/TituloTareaModel.js';

async function mostrarTareas(req, res) {
  try {
    const tareas = await TareaModel.listarTareas();
    res.render('tareas/tareas', { 
      titulo: 'Lista de Tareas', 
      tareas: tareas || [] 
    });
  } catch (error) {
    console.error("Error al mostrar tareas:", error);
    res.render('tareas/tareas', { 
      titulo: 'Lista de Tareas', 
      tareas: [], 
      mensajeError: error.message 
    });
  }
}

async function formularioNuevaTarea(req, res) {
  try {
    const areas = await AreaModel.obtenerAreas();
    const empleados = await EmpleadoModel.obtenerEmpleados();
    const tareasPosibles = await TituloTareaModel.obtenerTitulos();

    res.render('tareas/nuevaTarea', {
      titulo: 'Nueva Tarea',
      areas,
      empleados,
      tareasPosibles
    });
  } catch (error) {
    console.error("Error al mostrar formulario nueva tarea:", error);
    res.render('tareas/nuevaTarea', {
      titulo: 'Nueva Tarea',
      areas: [],
      empleados: [],
      tareasPosibles: [],
      mensajeError: error.message
    });
  }
}

async function guardarTarea(req, res) {
  try {
    const { titulo, area, documentoEmpleado, paciente, estado, prioridad, fechaInicio, fechaFin, proveedor, observaciones } = req.body;

    if (!titulo || !area || !documentoEmpleado) {
      return res.render('tareas/nuevaTarea', {
        titulo: 'Nueva Tarea',
        mensajeError: 'Los campos tarea, área y empleado son obligatorios',
        areas: await AreaModel.obtenerAreas(),
        empleados: await EmpleadoModel.obtenerEmpleados(),
        tareasPosibles: await TituloTareaModel.obtenerTitulos()
      });
    }

    await TareaModel.crearTarea({
      titulo,
      area,
      empleado: documentoEmpleado,
      paciente,
      estado,
      prioridad,
      fechaInicio,
      fechaFin,
      proveedor,
      observaciones
    });
    res.redirect('/tareas');
  } catch (error) {
    console.error("Error al guardar tarea:", error);
    res.render('tareas/nuevaTarea', {
      titulo: 'Nueva Tarea',
      mensajeError: error.message,
      areas: await AreaModel.obtenerAreas(),
      empleados: await EmpleadoModel.obtenerEmpleados(),
      tareasPosibles: await TituloTareaModel.obtenerTitulos()
    });
  }
}

async function formularioEditarTarea(req, res) {
  try {
    const id = parseInt(req.params.id);
    const tareas = await TareaModel.listarTareas();
    const tareaObj = tareas.find(t => t.id === id);
    if (!tareaObj) {
      return res.render('tareas/tareas', { 
        titulo: 'Lista de Tareas', 
        tareas, 
        mensajeError: "Tarea no encontrada." 
      });
    }

    const areas = await AreaModel.obtenerAreas();
    const empleados = await EmpleadoModel.obtenerEmpleados();
    const tareasPosibles = await TituloTareaModel.obtenerTitulos();

    res.render('tareas/editarTarea', {
      titulo: 'Editar Tarea',
      tarea: tareaObj,
      areas,
      empleados,
      tareasPosibles
    });
  } catch (error) {
    console.error("Error al mostrar formulario editar tarea:", error);
    res.render('tareas/tareas', { 
      titulo: 'Lista de Tareas', 
      tareas: [], 
      mensajeError: error.message
    });
  }
}

async function actualizarTarea(req, res) {
  try {
    const { id } = req.params;
    const { titulo, area, documentoEmpleado, paciente, estado, prioridad, fechaInicio, fechaFin, proveedor, observaciones } = req.body;

    await TareaModel.actualizarTarea(id, {
      titulo,
      area,
      empleado: documentoEmpleado,
      paciente,
      estado,
      prioridad,
      fechaInicio,
      fechaFin,
      proveedor,
      observaciones
    });
    res.redirect('/tareas');
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.render('tareas/tareas', { 
      titulo: 'Lista de Tareas', 
      tareas: await TareaModel.listarTareas(), 
      mensajeError: error.message
    });
  }
}

async function eliminarTarea(req, res) {
  try {
    const id = parseInt(req.params.id);
    await TareaModel.eliminarTarea(id);
    res.redirect('/tareas');
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.render('tareas/tareas', { 
      titulo: 'Lista de Tareas', 
      tareas: await TareaModel.listarTareas(), 
      mensajeError: error.message
    });
  }
}

async function filtrarTareas(req, res) {
  try {
    const filtros = req.query;
    const tareas = await TareaModel.filtrarTareas(filtros);
    res.render('tareas/tareas', { 
      titulo: 'Tareas Filtradas', 
      tareas 
    });
  } catch (error) {
    console.error("Error al filtrar tareas:", error);
    res.render('tareas/tareas', { 
      titulo: 'Tareas Filtradas', 
      tareas: [], 
      mensajeError: error.message
    });
  }
}

const tareaController = {
  mostrarTareas,
  formularioNuevaTarea,
  guardarTarea,
  formularioEditarTarea,
  actualizarTarea,
  eliminarTarea,
  filtrarTareas
};

export default tareaController;
