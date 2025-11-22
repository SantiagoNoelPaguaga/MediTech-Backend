import Empleado from "../models/EmpleadoModel.js";
import Medico from "../models/MedicoModel.js";
import EspecialidadController from "./especialidadController.js";

const verPerfil = async (req, res) => {
  try {
    let usuario;
    let esMedico = false;

    if (req.user.rol === "Médico") {
      usuario = await Medico.findOne({ dni: req.user.dni }).lean();
      esMedico = true;
    } else {
      usuario = await Empleado.obtenerPorId(req.user.id);
    }

    if (!usuario) {
      return res.status(404).render("perfil/perfil", {
        modalMessage: "Usuario no encontrado",
        modalType: "error",
        modalTitle: "Error",
        usuario: null,
        esMedico: false,
      });
    }

    res.render("perfil/perfil", {
      usuario,
      esMedico,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).render("perfil/perfil", {
      modalMessage: "Error obteniendo perfil",
      modalType: "error",
      modalTitle: "Error",
      usuario: null,
      esMedico: false,
    });
  }
};

const formEditarPerfil = async (req, res) => {
  try {
    let usuario;
    let esMedico = false;

    if (req.user.rol === "Médico") {
      usuario = await Medico.findOne({ dni: req.user.dni }).lean();
      esMedico = true;
    } else {
      usuario = await Empleado.obtenerPorId(req.user.id);
    }

    if (!usuario) {
      return res.status(404).render("perfil/editarPerfil", {
        modalMessage: "Usuario no encontrado",
        modalType: "error",
        modalTitle: "Error",
        usuario: null,
        esMedico: false,
        especialidades: [],
      });
    }

    let especialidades = [];
    if (esMedico) {
      especialidades = await EspecialidadController.obtenerEspecialidades();
    }

    res.render("perfil/editarPerfil", {
      usuario,
      esMedico,
      especialidades,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error("Error obteniendo perfil para editar:", error);
    res.status(500).render("perfil/editarPerfil", {
      modalMessage: "Error obteniendo perfil",
      modalType: "error",
      modalTitle: "Error",
      usuario: null,
      esMedico: false,
      especialidades: [],
    });
  }
};

const actualizarPerfil = async (req, res) => {
  const { nombre, apellido, telefono, email, domicilio, especialidades } =
    req.body;

  if (!nombre || !apellido) {
    let usuario;
    let esMedico = req.user.rol === "Médico";
    let especialidadesDisponibles = [];

    if (esMedico) {
      usuario = await Medico.findOne({ dni: req.user.dni }).lean();
      especialidadesDisponibles =
        await EspecialidadController.obtenerEspecialidades();
    } else {
      usuario = await Empleado.obtenerPorId(req.user.id);
    }

    return res.render("perfil/editarPerfil", {
      usuario,
      esMedico,
      especialidades: especialidadesDisponibles,
      modalMessage: "Todos los campos requeridos deben estar completos",
      modalType: "error",
      modalTitle: "Error",
    });
  }

  try {
    let usuarioActualizado;
    const esMedico = req.user.rol === "Médico";

    if (esMedico) {
      const datosActualizacion = {
        nombre,
        apellido,
        telefono: telefono || "",
        email: email || "",
        domicilio: domicilio || "",
      };

      if (especialidades) {
        if (Array.isArray(especialidades)) {
          datosActualizacion.especialidades = especialidades.filter((e) => e);
        } else {
          datosActualizacion.especialidades = especialidades
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e);
        }
      }

      usuarioActualizado = await Medico.findOneAndUpdate(
        { dni: req.user.dni },
        datosActualizacion,
        { new: true },
      ).lean();
    } else {
      usuarioActualizado = await Empleado.actualizarEmpleado(req.user.id, {
        nombre,
        apellido,
      });
    }

    res.render("perfil/perfil", {
      usuario: usuarioActualizado,
      esMedico,
      modalMessage: "Perfil actualizado correctamente",
      modalType: "success",
      modalTitle: "Éxito",
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    let usuario;
    let especialidadesDisponibles = [];
    const esMedico = req.user.rol === "Médico";

    if (esMedico) {
      usuario = await Medico.findOne({ dni: req.user.dni }).lean();
      especialidadesDisponibles =
        await EspecialidadController.obtenerEspecialidades();
    } else {
      usuario = await Empleado.obtenerPorId(req.user.id);
    }

    res.render("perfil/editarPerfil", {
      usuario,
      esMedico,
      especialidades: especialidadesDisponibles,
      modalMessage: "Error actualizando perfil",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

export default {
  verPerfil,
  formEditarPerfil,
  actualizarPerfil,
};
