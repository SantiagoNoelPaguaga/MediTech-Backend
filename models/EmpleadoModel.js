import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileEmpleados = path.join(__dirname, '../data/empleados.json');
const fileRoles = path.join(__dirname, '../data/roles.json');
const fileAreas = path.join(__dirname, '../data/areas.json');

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
async function obtenerEmpleados() {
  return await leerJSON(fileEmpleados);
}

// POST
async function crearEmpleado(nombre, rol, area, dni) {
  const rolesValidos = await leerJSON(fileRoles);
  const areasValidas = await leerJSON(fileAreas);

  if (!rolesValidos.includes(rol)) {
    throw new Error(`Rol inválido. Valores permitidos: ${rolesValidos.join(', ')}`);
  }
  if (!areasValidas.includes(area)) {
    throw new Error(`Área inválida. Valores permitidos: ${areasValidas.join(', ')}`);
  }
  if (!dni) throw new Error("DNI es requerido");

  const empleados = await obtenerEmpleados();
  if (empleados.some(e => e.dni === dni)) {
    throw new Error(`Ya existe un empleado con DNI ${dni}`);
  }

  const nuevoEmpleado = {
    id: empleados.length ? empleados[empleados.length - 1].id + 1 : 1,
    nombre,
    rol, 
    area,
    dni
  };

  empleados.push(nuevoEmpleado);
  await guardarJSON(fileEmpleados, empleados);
  return nuevoEmpleado;
}

// PUT
async function actualizarEmpleado(id, nombre, rol, area, dni) {
  const rolesValidos = await leerJSON(fileRoles);
  const areasValidas = await leerJSON(fileAreas);

  const empleados = await obtenerEmpleados();
  const index = empleados.findIndex(e => e.id === Number(id));
  if (index === -1) throw new Error("Empleado no encontrado");

  if (rol && !rolesValidos.includes(rol)) {
    throw new Error(`Rol inválido. Valores permitidos: ${rolesValidos.join(', ')}`);
  }
  if (area && !areasValidas.includes(area)) {
    throw new Error(`Área inválida. Valores permitidos: ${areasValidas.join(', ')}`);
  }
  if (dni && empleados.some((e, i) => e.dni === dni && i !== index)) {
    throw new Error(`Ya existe otro empleado con DNI ${dni}`);
  }

  if (nombre !== undefined) empleados[index].nombre = nombre;
  if (rol !== undefined) empleados[index].rol = rol;
  if (area !== undefined) empleados[index].area = area;
  if (dni !== undefined) empleados[index].dni = dni;

  await guardarJSON(fileEmpleados, empleados);
  return empleados[index];
}

// DELETE
async function eliminarEmpleado(id) {
  const empleados = await obtenerEmpleados();
  const index = empleados.findIndex(e => e.id === Number(id));

  if (index === -1) {
    throw new Error("Empleado no encontrado");
  }

  empleados.splice(index, 1); 
  await guardarJSON(fileEmpleados, empleados);
  return { mensaje: "Empleado eliminado" };
}

const EmpleadoModel = {
  obtenerEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
};

export default EmpleadoModel;