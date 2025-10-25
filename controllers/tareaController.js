import mongoose from "mongoose";
import Tarea from "../models/TareaModel.js";
import EmpleadoController from "./empleadoController.js";
import PacienteController from "./pacienteController.js";

const PROVEEDORES = [
  "Distribuidora Médica Sur",
  "Farmalab",
  "ProveSalud",
  "BioTech",
  "Medimport",
  "Otro",
];

const TITULOS_POR_AREA = {
  "Administración de Turnos": [
    "Alta de turno para paciente",
    "Reprogramación o cancelación de cita",
    "Confirmación de asistencia",
    "Asignación de médico a turno",
  ],
  "Atención Médica": [
    "Consulta general de paciente",
    "Control de signos vitales",
    "Aplicación de tratamiento o medicación",
    "Seguimiento post-tratamiento",
  ],
  "Gestión de Insumos Médicos": [
    "Carga de nuevo insumo al stock",
    "Control de vencimientos",
    "Reposición de materiales",
    "Baja por uso o descarte",
  ],
  Facturación: [
    "Generación de factura a paciente",
    "Registro de pagos recibidos",
    "Validación de cobertura de seguros",
    "Emisión de reportes contables",
  ],
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(String(id));

const normalizarDatosTarea = (raw) => {
  const data = raw || {};
  let empleadoId =
    typeof data.empleado === "string"
      ? data.empleado
      : data.empleado?.id || data.empleado?._id || data["empleado[id]"];

  if (!empleadoId && data.empleadoId) empleadoId = data.empleadoId;

  let pacienteId =
    data.pacienteId ||
    (data.paciente && typeof data.paciente === "string"
      ? data.paciente
      : data.paciente?._id || data.paciente?.id);

  const area =
    data.area ||
    data["empleado[area]"] ||
    data.empleado?.area ||
    data.areaHidden;

  const tareaData = {
    titulo: data.titulo,
    estado: data.estado,
    prioridad: data.prioridad,
    fechaInicio: data.fechaInicio,
    fechaFin: data.fechaFin,
    area,
    empleado: empleadoId,
    paciente: pacienteId || null,
    proveedor: data.proveedor || null,
    descripcion: data.descripcion,
    observaciones: data.observaciones,
  };

  if (tareaData.empleado && !isValidObjectId(tareaData.empleado)) {
    tareaData.empleado = null;
  }
  if (tareaData.paciente && !isValidObjectId(tareaData.paciente)) {
    tareaData.paciente = null;
  }

  return tareaData;
};

const validarCampos = (data) => {
  const required = [
    "titulo",
    "estado",
    "prioridad",
    "area",
    "empleado",
    "fechaInicio",
    "fechaFin",
  ];

  const etiquetas = {
    titulo: "Título",
    estado: "Estado",
    prioridad: "Prioridad",
    area: "Área",
    empleado: "Empleado",
    fechaInicio: "Fecha de inicio",
    fechaFin: "Fecha de fin",
  };

  const missing = required.filter(
    (f) => !data[f] || String(data[f]).trim() === ""
  );

  if (missing.length > 0) {
    const nombresLegibles = missing.map((f) => etiquetas[f] || f);
    return `Los siguientes campos son obligatorios: ${nombresLegibles.join(
      ", "
    )}.`;
  }

  if (new Date(data.fechaFin) < new Date(data.fechaInicio)) {
    return "La fecha de fin no puede ser anterior a la fecha de inicio.";
  }

  return null;
};

const mostrarTareas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const filtros = req.query || {};

    const { tareas, totalPages } = await Tarea.listar(page, perPage, filtros);

    res.render("tarea/tareas", {
      tareas,
      page,
      totalPages,
      filtros,
      dni: req.query.dni || "",
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error("Error al listar tareas:", error);
    res.render("tarea/tareas", {
      tareas: [],
      page: 1,
      totalPages: 1,
      filtros: {},
      modalMessage: "Error al cargar las tareas",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const formularioNuevaTarea = async (req, res) => {
  try {
    res.render("tarea/nuevaTarea", {
      formData: {},
      proveedores: PROVEEDORES,
      titulosPorArea: TITULOS_POR_AREA,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error("Error al cargar formulario de nueva tarea:", error);
    res.render("tarea/nuevaTarea", {
      formData: {},
      proveedores: PROVEEDORES,
      titulosPorArea: TITULOS_POR_AREA,
      modalMessage: "Error al cargar el formulario",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const guardarTarea = async (req, res) => {
  try {
    const dataRaw = req.body;
    const tareaData = normalizarDatosTarea(dataRaw);

    const errorValidacion = validarCampos(tareaData);
    if (errorValidacion) {
      return res.render("tarea/nuevaTarea", {
        modalMessage: errorValidacion,
        modalType: "error",
        modalTitle: "Error",
        formData: dataRaw,
        proveedores: PROVEEDORES,
        titulosPorArea: TITULOS_POR_AREA,
      });
    }

    await Tarea.crearTarea(tareaData);
    res.redirect("/tareas");
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.render("tarea/nuevaTarea", {
      modalMessage: "Error al guardar la tarea",
      modalType: "error",
      modalTitle: "Error",
      formData: req.body,
      proveedores: PROVEEDORES,
      titulosPorArea: TITULOS_POR_AREA,
    });
  }
};

const formularioEditarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.obtenerPorId(req.params.id);
    if (!tarea) return res.redirect("/tareas");

    const formData = {
      _id: tarea._id,
      titulo: tarea.titulo || "",
      estado: tarea.estado || "",
      prioridad: tarea.prioridad || "",
      fechaInicio: tarea.fechaInicio
        ? tarea.fechaInicio.toISOString().slice(0, 10)
        : "",
      fechaFin: tarea.fechaFin ? tarea.fechaFin.toISOString().slice(0, 10) : "",
      area: tarea.area || "",
      proveedor: tarea.proveedor || "",
      descripcion: tarea.descripcion || "",
      observaciones: tarea.observaciones || "",
      empleado: tarea.empleado?._id ? String(tarea.empleado._id) : "",
      dniEmpleado: tarea.empleado?.dni || "",
      nombreEmpleado: tarea.empleado?.nombre || "",
      apellidoEmpleado: tarea.empleado?.apellido || "",
      rolEmpleado: tarea.empleado?.rol || "",
      pacienteId: tarea.paciente?._id ? String(tarea.paciente._id) : "",
      dniPaciente: tarea.paciente?.dni || "",
      nombrePaciente: tarea.paciente?.nombre || "",
      apellidoPaciente: tarea.paciente?.apellido || "",
    };

    res.render("tarea/editarTarea", {
      tarea: formData,
      proveedores: PROVEEDORES,
      titulosPorArea: TITULOS_POR_AREA,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error("Error al cargar formulario de edición:", error);
    res.redirect("/tareas");
  }
};

const actualizarTarea = async (req, res) => {
  try {
    const dataRaw = req.body;
    const tareaData = normalizarDatosTarea(dataRaw);
    const errorValidacion = validarCampos(tareaData);

    if (errorValidacion) {
      const tareaCompleta = {
        _id: req.params.id,
        titulo: tareaData.titulo || "",
        estado: tareaData.estado || "",
        prioridad: tareaData.prioridad || "",
        fechaInicio: tareaData.fechaInicio || "",
        fechaFin: tareaData.fechaFin || "",
        area: tareaData.area || "",
        empleado: tareaData.empleado || "",
        dniEmpleado: dataRaw.dniEmpleado || "",
        nombreEmpleado: dataRaw.nombreEmpleado || "",
        apellidoEmpleado: dataRaw.apellidoEmpleado || "",
        rolEmpleado: dataRaw.rolEmpleado || "",
        pacienteId: tareaData.paciente || "",
        dniPaciente: dataRaw.dniPaciente || "",
        nombrePaciente: dataRaw.nombrePaciente || "",
        apellidoPaciente: dataRaw.apellidoPaciente || "",
        proveedor: tareaData.proveedor || "",
        descripcion: tareaData.descripcion || "",
        observaciones: tareaData.observaciones || "",
      };

      return res.render("tarea/editarTarea", {
        modalMessage: errorValidacion,
        modalType: "error",
        modalTitle: "Error",
        tarea: tareaCompleta,
        proveedores: PROVEEDORES,
        titulosPorArea: TITULOS_POR_AREA,
      });
    }
    await Tarea.actualizarTarea(req.params.id, tareaData);
    res.redirect("/tareas");
  } catch (error) {
    console.error("Error al actualizar tarea:", error);

    const tareaCompleta = {
      _id: req.params.id,
      titulo: req.body.titulo || "",
      estado: req.body.estado || "",
      prioridad: req.body.prioridad || "",
      fechaInicio: req.body.fechaInicio || "",
      fechaFin: req.body.fechaFin || "",
      area: req.body.area || "",
      empleado: req.body.empleado || "",
      dniEmpleado: req.body.dniEmpleado || "",
      nombreEmpleado: req.body.nombreEmpleado || "",
      apellidoEmpleado: req.body.apellidoEmpleado || "",
      rolEmpleado: req.body.rolEmpleado || "",
      pacienteId: req.body.pacienteId || "",
      dniPaciente: req.body.dniPaciente || "",
      nombrePaciente: req.body.nombrePaciente || "",
      apellidoPaciente: req.body.apellidoPaciente || "",
      proveedor: req.body.proveedor || "",
      descripcion: req.body.descripcion || "",
      observaciones: req.body.observaciones || "",
    };

    res.render("tarea/editarTarea", {
      modalMessage: "Error al actualizar la tarea",
      modalType: "error",
      modalTitle: "Error",
      tarea: tareaCompleta,
      proveedores: PROVEEDORES,
      titulosPorArea: TITULOS_POR_AREA,
    });
  }
};

const eliminarTarea = async (req, res) => {
  try {
    await Tarea.eliminarTarea(req.params.id);
    res.redirect("/tareas");
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.redirect("/tareas");
  }
};

const filtrarTareas = async (req, res) => {
  try {
    const filtros = req.query;
    const tareas = await Tarea.filtrarTareas(filtros);

    res.render("tarea/tareas", {
      tareas,
      filtros,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error("Error al filtrar tareas:", error);
    res.render("tarea/tareas", {
      tareas: [],
      filtros: {},
      modalMessage: "Error al aplicar filtros",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const apiBuscarEmpleado = async (req, res) => {
  try {
    const { dni } = req.params;
    if (!dni) return res.status(400).json({ error: "Falta DNI" });

    const empleado = await EmpleadoController.obtenerPorDni(dni);
    if (!empleado)
      return res.status(404).json({ error: "Empleado no encontrado" });

    const empleadoDatos = {
      _id: empleado._id,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      dni: empleado.dni,
      rol: empleado.rol,
      area: empleado.area,
    };

    res.json(empleadoDatos);
  } catch (error) {
    console.error("Error API buscar empleado:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

const apiBuscarPaciente = async (req, res) => {
  try {
    const { dni } = req.params;
    if (!dni) return res.status(400).json({ error: "Falta DNI" });

    const paciente = await PacienteController.obtenerPorDni(dni);
    if (!paciente)
      return res.status(404).json({ error: "Paciente no encontrado" });

    const pacienteDatos = {
      _id: paciente._id,
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      dni: paciente.dni,
    };

    res.json(pacienteDatos);
  } catch (error) {
    console.error("Error API buscar paciente:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export default {
  mostrarTareas,
  formularioNuevaTarea,
  guardarTarea,
  formularioEditarTarea,
  actualizarTarea,
  eliminarTarea,
  filtrarTareas,
  apiBuscarEmpleado,
  apiBuscarPaciente,
};
