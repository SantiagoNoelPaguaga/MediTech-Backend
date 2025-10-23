import Paciente from "../models/PacienteModel.js";
import CoberturaController from "./coberturaController.js";

const validarCampos = (data) => {
  const requiredFields = [
    "nombre",
    "apellido",
    "dni",
    "cobertura",
    "email",
    "telefono",
    "domicilio",
  ];
  const missingFields = requiredFields.filter(
    (field) => !data[field] || data[field].trim() === ""
  );
  if (missingFields.length > 0) {
    return `Los siguientes campos son obligatorios: ${missingFields.join(
      ", "
    )}`;
  }
  return null;
};

const mostrarPacientes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 12;
    const dni = req.query.dni || "";

    const { pacientes, totalPages } = await Paciente.listar(page, perPage, dni);
    res.render("paciente/pacientes", {
      pacientes,
      page,
      totalPages,
      dni,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error(error);
    res.render("paciente/pacientes", {
      pacientes: [],
      page: 1,
      totalPages: 1,
      dni: "",
      modalMessage: "Error al cargar pacientes",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const formularioNuevoPaciente = async (req, res) => {
  try {
    const coberturas = await CoberturaController.obtenerCoberturas();

    res.render("paciente/nuevoPaciente", {
      formData: {},
      coberturas,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error("Error al cargar formulario de nuevo paciente:", error);

    res.render("paciente/nuevoPaciente", {
      formData: {},
      coberturas: [],
      modalMessage: "Error al cargar las coberturas",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const guardarPaciente = async (req, res) => {
  const data = req.body;

  const errorValidacion = validarCampos(data);
  if (errorValidacion) {
    const coberturas = await CoberturaController.obtenerCoberturas();
    return res.render("paciente/nuevoPaciente", {
      modalMessage: errorValidacion,
      modalType: "error",
      modalTitle: "Error",
      formData: data,
      coberturas,
    });
  }

  try {
    await Paciente.crearPaciente(data);
    res.redirect("/pacientes");
  } catch (error) {
    console.error(error);

    let message = "Error al guardar paciente";
    if (error.code === 11000) message = "Ya existe un paciente con ese DNI";

    const coberturas = await CoberturaController.obtenerCoberturas();
    res.render("paciente/nuevoPaciente", {
      modalMessage: message,
      modalType: "error",
      modalTitle: "Error",
      formData: data,
      coberturas,
    });
  }
};

const formularioEditarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.obtenerPorId(req.params.id);
    if (!paciente) return res.redirect("/pacientes");

    const coberturas = await CoberturaController.obtenerCoberturas();

    res.render("paciente/editarPaciente", {
      paciente,
      coberturas,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error("Error al cargar formulario de edición:", error);
    res.redirect("/pacientes");
  }
};

const actualizarPaciente = async (req, res) => {
  const data = req.body;

  const errorValidacion = validarCampos(data);
  if (errorValidacion) {
    const coberturas = await CoberturaController.obtenerCoberturas();
    return res.render("paciente/editarPaciente", {
      modalMessage: errorValidacion,
      modalType: "error",
      modalTitle: "Error",
      paciente: { _id: req.params.id, ...data },
      coberturas,
    });
  }

  try {
    await Paciente.actualizarPaciente(req.params.id, data);
    res.redirect("/pacientes");
  } catch (error) {
    console.error(error);

    let message = "Error al actualizar paciente";
    if (error.code === 11000) message = "Ya existe un paciente con ese DNI";

    const coberturas = await CoberturaController.obtenerCoberturas();
    res.render("paciente/editarPaciente", {
      modalMessage: message,
      modalType: "error",
      modalTitle: "Error",
      paciente: { _id: req.params.id, ...data },
      coberturas,
    });
  }
};

const eliminarPaciente = async (req, res) => {
  try {
    await Paciente.eliminarPaciente(req.params.id);
    res.redirect("/pacientes");
  } catch (error) {
    console.error(error);
    const page = 1;
    const perPage = 12;
    const { pacientes, totalPages } = await Paciente.listar(page, perPage);
    res.render("paciente/pacientes", {
      pacientes,
      page,
      totalPages,
      dni: "",
      modalMessage: "Error al eliminar paciente",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const buscarPorDniForm = async (req, res) => {
  try {
    const { dni } = req.query;

    if (!dni) {
      return res.render("turno/nuevoTurno", {
        modalMessage: "Debe ingresar un DNI",
        modalType: "error",
        modalTitle: "Error",
        formData: {},
      });
    }

    const paciente = await Paciente.obtenerPorDni(dni);

    if (!paciente) {
      return res.render("turno/nuevoTurno", {
        modalMessage: `No se encontró un paciente con DNI ${dni}`,
        modalType: "error",
        modalTitle: "Paciente no encontrado",
        formData: {},
      });
    }

    res.render("turno/nuevoTurno", {
      modalMessage: null,
      modalType: null,
      modalTitle: null,
      formData: {
        id: paciente._id,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        dni: paciente.dni,
      },
    });
  } catch (error) {
    console.error("Error al buscar paciente para turno:", error);
    res.render("turno/nuevoTurno", {
      modalMessage: "Error interno al buscar paciente",
      modalType: "error",
      modalTitle: "Error",
      formData: {},
    });
  }
};

export default {
  mostrarPacientes,
  formularioNuevoPaciente,
  guardarPaciente,
  formularioEditarPaciente,
  actualizarPaciente,
  eliminarPaciente,
  buscarPorDniForm,
};
