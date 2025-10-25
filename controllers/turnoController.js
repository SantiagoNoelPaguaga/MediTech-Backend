import Turno from "../models/TurnoModel.js";
import PacienteController from "../controllers/pacienteController.js"
import MedicoController from "../controllers/medicoController.js";
import EspecialidadController from "../controllers/especialidadController.js";
import TipoTurnoController from "../controllers/tipoTurnoController.js";
import EstudioMedicoController from "../controllers/estudioMedicoController.js";

const validarCampos = (data) => {
 const requiredFields = [
  "pacienteId",
  "dniPaciente",
  "nombrePaciente",
  "fecha",
  "tipoTurno",
  "descripcion",
  "medicoId",
  "nombreMedico",
  "estado",
 ];

 const missingFields = requiredFields.filter(
  (field) =>
   !data[field] ||
   (typeof data[field] === 'string' && data[field].trim() === "")
 );

 if (missingFields.length > 0) {
  return `Los siguientes campos son obligatorios: ${missingFields.join(
   ", "
  )}`;
 }
 return null;
};

const mostrarTurnos = async (req, res) => {
 try {
  const page = parseInt(req.query.page) || 1;
  const perPage = 12;
  const dni = req.query.dni || "";
  const fecha = req.query.fecha || "";

  const { turnos, totalPages } = await Turno.listar(page, perPage, dni, fecha);
  res.render("turno/turnos", {
   turnos,
   page,
   totalPages,
   dni,
   fecha,
   modalMessage: null,
   modalType: null,
   modalTitle: null,
  });
 } catch (error) {
  console.error(error);
  res.render("turno/turnos", {
   turnos: [],
   page: 1,
   totalPages: 1,
   dni: "",
   modalMessage: "Error al cargar turnos",
   modalType: "error",
   modalTitle: "Error",
  });
 }
};

const formularioNuevoTurno = async (req, res) => {
 try {
  const medicos = await MedicoController.obtenerMedicos();
  res.render("turno/nuevoTurno", {
   formData: {},
   medicos,
   modalMessage: null,
   modalType: null,
   modalTitle: null,
  });
 } catch (error) {
  console.error("Error al cargar formulario de nuevo turno:", error);

  res.render("turno/nuevoTurno", {
   formData: {},
   medicos: [],
   modalMessage: "Error al cargar el formulario",
   modalType: "error",
   modalTitle: "Error",
  });
 }
};

const guardarTurno = async (req, res) => {
 const rawData = req.body;
 const data = {
  fecha: rawData.fecha,
  tipoTurno: rawData.tipoTurno,
  descripcion: rawData.descripcion,
  estado: rawData.estado,
  pacienteId: rawData.paciente ? rawData.paciente.id : undefined,
  dniPaciente: rawData.paciente ? rawData.paciente.dni : undefined,
  nombrePaciente: rawData.paciente ? rawData.paciente.nombre : undefined,
  medicoId: rawData.medico ? rawData.medico.id : undefined,
  nombreMedico: rawData.medico ? rawData.medico.nombre : undefined,
 };

 const errorValidacion = validarCampos(data);

 if (errorValidacion) {
  return res.render("turno/nuevoTurno", {
   modalMessage: errorValidacion,
   modalType: "error",
   modalTitle: "Error",
   formData: rawData,
  });
 }

 try {
  await Turno.crearTurno(data);
  res.redirect("/turnos");
 } catch (error) {
  let message = "Error al guardar turno";
  res.render("turno/nuevoTurno", {
   modalMessage: message,
   modalType: "error",
   modalTitle: "Error",
   formData: rawData,
  });
 }
};

const formularioEditarTurno = async (req, res) => {
 try {
  const turnoId = req.params.id;
  const turno = await Turno.obtenerPorId(turnoId);

  if (!turno) {
   return res.status(404).send("Turno no encontrado");
  }

  if (turno.fecha instanceof Date) {
   const date = new Date(turno.fecha);
   const offsetMinutes = date.getTimezoneOffset();

   date.setMinutes(date.getMinutes() - offsetMinutes);
   turno.fechaFormatted = date.toISOString().slice(0, 16);
  } else {
   turno.fechaFormatted = turno.fecha ? new Date(turno.fecha).toISOString().slice(0, 16) : '';
  }

  res.render('turno/editarTurno', {
   turno: turno,
  });

 } catch (error) {
  console.error(error);
  res.status(500).send("Error al cargar turno para edición");
 }
};

const actualizarTurno = async (req, res) => {
 const rawData = req.body;
 const turnoId = req.params.id;

 const data = {
  fecha: rawData.fecha,
  tipoTurno: rawData.tipoTurno,
  descripcion: rawData.descripcion,
  estado: rawData.estado,
  pacienteId: rawData.paciente ? rawData.paciente.id : undefined,
  dniPaciente: rawData.paciente ? rawData.paciente.dni : undefined,
  nombrePaciente: rawData.paciente ? rawData.paciente.nombre : undefined,
  medicoId: rawData.medico ? rawData.medico.id : undefined,
  nombreMedico: rawData.medico ? rawData.medico.nombre : undefined,
 };

 const errorValidacion = validarCampos(data);

 if (errorValidacion) {
  return res.render("turno/editarTurno", {
   modalMessage: errorValidacion,
   modalType: "error",
   modalTitle: "Error",
   turno: { _id: turnoId, ...rawData },
   formData: rawData
  });
 }

 try {
  await Turno.actualizarTurno(turnoId, data);
  res.redirect("/turnos");

 } catch (error) {
  console.error(error);
  let message = "Error al actualizar turno";
  if (error.name === 'CastError') {
   message = `Error de formato de ID en el campo: ${error.path}. Asegúrate de que los IDs del paciente y médico sean válidos.`;
  }

  return res.render("turno/editarTurno", {
   modalMessage: message,
   modalType: "error",
   modalTitle: "Error",
   turno: { _id: turnoId, ...rawData },
   formData: rawData
  });
 }
};

const eliminarTurno = async (req, res) => {
 try {
  await Turno.eliminarTurno(req.params.id);
  res.redirect("/turnos");
 } catch (error) {
  console.error(error);
  const page = 1;
  const perPage = 12;
  const { turnos, totalPages } = await Turno.listar(page, perPage);
  res.render("turno/turnos", {
   turnos,
   page,
   totalPages,
   dni: "",
   modalMessage: "Error al eliminar turno",
   modalType: "error",
   modalTitle: "Error",
  });
 }
};

const buscarPorIdForm = async (req, res) => {
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

  const turno = await Turno.obtenerPorDni(dni);

  if (!turno) {
   return res.render("turno/nuevoTurno", {
    modalMessage: `No se encontró un turno con DNI ${dni}`,
    modalType: "error",
    modalTitle: "Turno no encontrado",
    formData: {},
   });
  }

  res.render("turno/nuevoTurno", {
   modalMessage: null,
   modalType: null,
   modalTitle: null,
   formData: {
    id: turno._id,
    nombre: turno.nombre,
    apellido: turno.apellido,
    dni: turno.dni,
   },
  });
 } catch (error) {
  console.error("Error al buscar turno:", error);
  res.render("turno/nuevoTurno", {
   modalMessage: "Error interno al buscar turno",
   modalType: "error",
   modalTitle: "Error",
   formData: {},
  });
 }
};

const buscarPacientePorIdForm = async (req, res) => {
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

    const paciente = await PacienteController.obtenerPorDni(dni);

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

const obtenerMedicosAPI = async (req, res) => {
    try {
        const medicos = await MedicoController.obtenerMedicos();
        res.json(medicos); 
    } catch (error) {
        console.error("Error al obtener médicos para API:", error);
        res.status(500).json({ 
            modalMessage: "Error al obtener médicos",
            modalType: "error",
            modalTitle: "Error interno"
        });
    }
};

const obtenerEspecialidadesAPI = async (req, res) => {
    try {
        const especialidades = await EspecialidadController.obtenerEspecialidades();
        res.json(especialidades); 
    } catch (error) {
        console.error("Error al obtener especialidades para API:", error);
        res.status(500).json({ 
            modalMessage: "Error al obtener especialidades",
            modalType: "error",
            modalTitle: "Error interno"
        });
    }
};

const obtenerTipoTurnosAPI = async (req, res) => {
 try {
     const tipoTurnos = await TipoTurnoController.obtenerTipoTurnos();
     res.json(tipoTurnos); 
 } catch (error) {
     console.error("Error al obtener tipo turnos para API:", error);
     res.status(500).json({ 
         modalMessage: "Error al obtener tipo turnos",
         modalType: "error",
         modalTitle: "Error interno"
     });
 }
}

const obtenerEstudioMedicosAPI = async (req, res) => {
 try {
     const tipoTurnos = await EstudioMedicoController.obtenerEstudiosMedicos();
     res.json(tipoTurnos); 
 } catch (error) {
     console.error("Error al obtener estudios medicos para API:", error);
     res.status(500).json({ 
         modalMessage: "Error al obtener estudios medicos",
         modalType: "error",
         modalTitle: "Error interno"
     });
 }
}

export default {
 mostrarTurnos,
 formularioNuevoTurno,
 guardarTurno,
 formularioEditarTurno,
 actualizarTurno,
 eliminarTurno,
 buscarPorIdForm,
 buscarPacientePorIdForm,
 obtenerMedicosAPI,
 obtenerEspecialidadesAPI,
 obtenerTipoTurnosAPI,
 obtenerEstudioMedicosAPI
};
