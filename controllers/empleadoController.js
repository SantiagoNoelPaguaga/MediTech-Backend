import Empleado from "../models/EmpleadoModel.js";
import MedicoController from "./medicoController.js";
import bcrypt from "bcryptjs";
import { generarPassword } from "../utils/passwordGenerator.js";

const validarCampos = (data) => {
  const requiredFields = ["nombre", "apellido", "dni", "rol", "area"];
  const missingFields = requiredFields.filter(
    (field) => !data[field] || data[field].trim() === "",
  );
  if (missingFields.length > 0) {
    return `Los siguientes campos son obligatorios: ${missingFields.join(
      ", ",
    )}`;
  }
  return null;
};

const rolesExcluidos = ["Médico"];
const areasExcluidas = ["Atención Médica"];

const mostrarEmpleados = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 12;
    const dni = req.query.dni || "";

    const { empleados, totalPages } = await Empleado.listar(page, perPage, dni);
    res.render("empleado/empleados", {
      empleados,
      page,
      totalPages,
      dni,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error(error);
    res.render("empleado/empleados", {
      empleados: [],
      page: 1,
      totalPages: 1,
      dni: "",
      modalMessage: "Error al cargar empleados",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const formularioNuevoEmpleado = async (req, res) => {
  try {
    const roles = Empleado.obtenerRoles().filter(
      (rol) => !rolesExcluidos.includes(rol),
    );
    const areas = Empleado.obtenerAreas().filter(
      (area) => !areasExcluidas.includes(area),
    );

    res.render("empleado/nuevoEmpleado", {
      formData: {},
      roles,
      areas,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error("Error al cargar formulario de nuevo empleado:", error);
    res.render("empleado/nuevoEmpleado", {
      formData: {},
      roles: [],
      areas: [],
      modalMessage: "Error al cargar roles y áreas",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const guardarEmpleado = async (req, res) => {
  const data = req.body;

  const errorValidacion = validarCampos(data);
  if (errorValidacion) {
    return renderErrorNuevo(res, data, errorValidacion);
  }

  if (data.rol === "Médico") {
    return renderErrorNuevo(
      res,
      data,
      "No está permitido registrar empleados con rol de Médico desde este formulario.",
    );
  }

  try {
    const initialPassword = generarPassword();
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(initialPassword, saltRounds);

    const empleadoData = {
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      rol: data.rol,
      area: data.area,
      passwordHash: passwordHash,
      mustChangePassword: true,
    };

    await Empleado.crearEmpleado(empleadoData);

    const roles = Empleado.obtenerRoles().filter(
      (rol) => !rolesExcluidos.includes(rol),
    );
    const areas = Empleado.obtenerAreas().filter(
      (area) => !areasExcluidas.includes(area),
    );

    return res.render("empleado/nuevoEmpleado", {
      formData: {},
      roles,
      areas,
      modalMessage:
        "Empleado creado correctamente.\n\n" +
        "Contraseña inicial: " +
        initialPassword +
        "\n\nIMPORTANTE: debe cambiarla en su primer ingreso.",
      modalType: "info",
      modalTitle: "Contraseña inicial",
    });
  } catch (error) {
    console.error(error);
    let message = "Error al guardar empleado";
    if (error.code === 11000) message = "Ya existe un empleado con ese DNI";
    return renderErrorNuevo(res, data, message);
  }
};

const renderErrorNuevo = (res, data, message) => {
  const roles = Empleado.obtenerRoles().filter(
    (rol) => !rolesExcluidos.includes(rol),
  );
  const areas = Empleado.obtenerAreas().filter(
    (area) => !areasExcluidas.includes(area),
  );
  res.render("empleado/nuevoEmpleado", {
    modalMessage: message,
    modalType: "error",
    modalTitle: "Error",
    formData: data,
    roles,
    areas,
  });
};

const formularioEditarEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.obtenerPorId(req.params.id);
    if (!empleado) return res.redirect("/empleados");

    const roles = Empleado.obtenerRoles().filter(
      (rol) => !rolesExcluidos.includes(rol),
    );
    const areas = Empleado.obtenerAreas().filter(
      (area) => !areasExcluidas.includes(area),
    );

    res.render("empleado/editarEmpleado", {
      empleado,
      roles,
      areas,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error("Error al cargar formulario de edición:", error);
    res.redirect("/empleados");
  }
};

const actualizarEmpleado = async (req, res) => {
  const data = req.body;

  const errorValidacion = validarCampos(data);
  if (errorValidacion) {
    return renderErrorEditar(res, req.params.id, data, errorValidacion);
  }

  try {
    const empleadoExistente = await Empleado.obtenerPorId(req.params.id);
    if (!empleadoExistente) return res.redirect("/empleados");

    if (empleadoExistente.rol === "Médico") {
      return res.redirect("/empleados");
    }

    await Empleado.actualizarEmpleado(req.params.id, data);
    res.redirect("/empleados");
  } catch (error) {
    console.error(error);
    let message = "Error al actualizar empleado";
    if (error.code === 11000) message = "Ya existe un empleado con ese DNI";
    return renderErrorEditar(res, req.params.id, data, message);
  }
};

const renderErrorEditar = (res, id, data, message) => {
  const roles = Empleado.obtenerRoles().filter(
    (rol) => !rolesExcluidos.includes(rol),
  );
  const areas = Empleado.obtenerAreas().filter(
    (area) => !areasExcluidas.includes(area),
  );

  res.render("empleado/editarEmpleado", {
    modalMessage: message,
    modalType: "error",
    modalTitle: "Error",
    empleado: { _id: id, ...data },
    roles,
    areas,
  });
};

const eliminarEmpleado = async (req, res) => {
  try {
    const empleadoExistente = await Empleado.obtenerPorId(req.params.id);
    if (!empleadoExistente || empleadoExistente.rol === "Médico") {
      return res.redirect("/empleados");
    }

    await Empleado.eliminarEmpleado(req.params.id);
    res.redirect("/empleados");
  } catch (error) {
    console.error(error);
    const page = 1;
    const perPage = 12;
    const { empleados, totalPages } = await Empleado.listar(page, perPage);
    res.render("empleado/empleados", {
      empleados,
      page,
      totalPages,
      dni: "",
      modalMessage: "Error al eliminar empleado",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const crearEmpleadoInterno = async (data) => {
  const empleadoExistente = await Empleado.obtenerPorDni(data.dni);
  if (empleadoExistente) {
    return { ok: false, message: "Ya existe un empleado con ese DNI" };
  }

  const initialPassword = generarPassword();
  const passwordHash = await bcrypt.hash(initialPassword, 10);

  const empleadoData = {
    ...data,
    rol: "Médico",
    area: "Atención Médica",
    passwordHash,
    mustChangePassword: true,
  };

  await Empleado.crearEmpleado(empleadoData);
  return { ok: true, initialPassword };
};

const actualizarEmpleadoInterno = async (medicoId, data) => {
  const medico = await MedicoController.obtenerMedicoPorId(medicoId);
  if (!medico) throw new Error("Médico no encontrado");

  const empleadoExistente = await Empleado.obtenerPorDni(medico.dni);
  if (!empleadoExistente) throw new Error("Empleado no encontrado");

  const empleadoData = {
    ...data,
    rol: "Médico",
    area: "Atención Médica",
  };

  await Empleado.actualizarEmpleado(empleadoExistente._id, empleadoData);
  return true;
};

const eliminarEmpleadoInterno = async (medicoId) => {
  const medico = await MedicoController.obtenerMedicoPorId(medicoId);
  if (!medico) throw new Error("Médico no encontrado");

  const empleadoExistente = await Empleado.obtenerPorDni(medico.dni);
  if (!empleadoExistente) throw new Error("Empleado no encontrado");

  await Empleado.eliminarEmpleado(empleadoExistente._id);
  return true;
};

const obtenerPorDni = async (dni) => {
  if (!dni || dni.trim() === "") {
    return null;
  }

  const empleado = await Empleado.obtenerPorDni(dni);
  return empleado || null;
};

export default {
  mostrarEmpleados,
  formularioNuevoEmpleado,
  guardarEmpleado,
  formularioEditarEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  crearEmpleadoInterno,
  actualizarEmpleadoInterno,
  eliminarEmpleadoInterno,
  obtenerPorDni,
};
