import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileTareas = path.join(__dirname, '../data/tareas.json');
const fileEmpleados = path.join(__dirname, '../data/empleados.json');
const filePacientes = path.join(__dirname, '../data/pacientes.json');
const fileAreas = path.join(__dirname, '../data/areas.json');
const fileTareasTitulos = path.join(__dirname, '../data/tareasTitulos.json');

async function leerJSON(ruta) {
  try {
    const data = await readFile(ruta, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function guardarJSON(ruta, datos) {
  await writeFile(ruta, JSON.stringify(datos, null, 2));
}

// GET
async function listarTareas() {
  return await leerJSON(fileTareas);
}

// POST
async function crearTarea(datos) {
  const areasValidas = await leerJSON(fileAreas);
  const tareasTitulos = await leerJSON(fileTareasTitulos);
  const empleados = await leerJSON(fileEmpleados);
  const pacientes = await leerJSON(filePacientes);

  //Solo se permiten áreas que estén en areas.json
  if (!areasValidas.includes(datos.area)) {
    throw new Error(`Área inválida. Valores permitidos: ${areasValidas.join(', ')}`);
  }

  //Convierte todos los títulos de todas las áreas en un solo arreglo y verifica que el título enviado exista
  const titulosValidos = Object.values(tareasTitulos).flat();
  if (!titulosValidos.includes(datos.titulo)) {
    throw new Error(`Tarea inválida. Valores permitidos: ${titulosValidos.join(', ')}`);
  }

  //Verifica que haya un empleado con ese DNI
  if (
    !empleados.some(
      e => e.dni === datos.empleado
    )
  ) {
    throw new Error('Empleado asignado no existe.');
  }

  //Solo valida si el campo paciente fue enviado
  if (
    datos.paciente &&
    !pacientes.some(p => p.dni === datos.paciente)
  ) {
    throw new Error('Paciente asignado no existe.');
  }

  //Generación de ID
  //Si hay tareas, toma el último ID y le suma 1. Si no hay, empieza en 1
  const tareas = await listarTareas();
  const nuevaTarea = {
    id: tareas.length ? tareas[tareas.length - 1].id + 1 : 1,
    ...datos
  };

  //Sobrescribe el archivo tareas.json con el nuevo arreglo que incluye la tarea creada
  tareas.push(nuevaTarea);
  await guardarJSON(fileTareas, tareas);
  return nuevaTarea;
}

// PUT
async function actualizarTarea(id, datos) {
  const tareas = await listarTareas();
  const index = tareas.findIndex(t => t.id === Number(id));
  if (index === -1) throw new Error('Tarea no encontrada');

  const areasValidas = await leerJSON(fileAreas);
  const tareasTitulos = await leerJSON(fileTareasTitulos);
  const empleados = await leerJSON(fileEmpleados);
  const pacientes = await leerJSON(filePacientes);

  if (datos.area && !areasValidas.includes(datos.area)) {
    throw new Error(`Área inválida. Valores permitidos: ${areasValidas.join(', ')}`);
  }

  if (datos.titulo) {
    const titulosValidos = Object.values(tareasTitulos).flat();
    if (!titulosValidos.includes(datos.titulo)) {
      throw new Error(`Tarea inválida. Valores permitidos: ${titulosValidos.join(', ')}`);
    }
  }

  if (
    datos.empleado &&
    !empleados.some(
      e => e.dni === datos.empleado
    )
  ) {
    throw new Error('Empleado asignado no existe.');
  }

  if (
    datos.paciente &&
    !pacientes.some(p => p.dni === datos.paciente)
  ) {
    throw new Error('Paciente asignado no existe.');
  }

  tareas[index] = { ...tareas[index], ...datos };
  await guardarJSON(fileTareas, tareas);
  return tareas[index];
}

// DELETE
async function eliminarTarea(id) {
  const tareas = await listarTareas();
  const index = tareas.findIndex(t => t.id === Number(id));

  if (index === -1) {
    throw new Error('Tarea no encontrada');
  }

  tareas.splice(index, 1);
  await guardarJSON(fileTareas, tareas);
  return { mensaje: 'Tarea eliminada' };
}

// FILTRAR
async function filtrarTareas(filtros) {
  const tareas = await listarTareas();

  const resultado = tareas.filter(t => {
    let cumple = true;

    if (filtros.estado) {
      cumple = cumple && t.estado?.trim().toLowerCase() === filtros.estado.trim().toLowerCase();
    }
    if (filtros.prioridad) {
      cumple = cumple && t.prioridad?.trim().toLowerCase() === filtros.prioridad.trim().toLowerCase();
    }
    if (filtros.empleado) {
      cumple = cumple && t.empleado?.trim() === filtros.empleado.trim();
    }
    if (filtros.paciente) {
      cumple = cumple && t.paciente?.trim() === filtros.paciente.trim();
    }
    if (filtros.fechaInicio && t.fechaInicio) {
      cumple = cumple && new Date(t.fechaInicio) >= new Date(filtros.fechaInicio);
    }
    if (filtros.fechaFin && t.fechaFin) {
      cumple = cumple && new Date(t.fechaFin) <= new Date(filtros.fechaFin);
    }

    return cumple;
  });

  return resultado; 
}

const TareaModel = {
  listarTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  filtrarTareas
};

export default TareaModel;