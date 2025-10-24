import EstudioMedico from "../models/EstudioMedicoModel.js";

class EstudioMedicoController {
  static async obtenerEstudiosMedicos() {
    try {
      const estudiosMedicos = await EstudioMedico.obtenerTodos();
      return estudiosMedicos;
    } catch (error) {
      console.error("Error al obtener estudios medicos:", error);
      throw new Error("No se pudieron obtener los estudios medicos");
    }
  }

  static async buscarEstudioMedicoId(id) {
    try {
      const tipoTurno = await EstudioMedico.buscarPorEstudioMedicoId(id);
      return tipoTurno;
    } catch (error) {
      console.error("Error al buscar estudio medico:", error);
      throw new Error("No se pudo buscar el estudio medico");
    }
  }
}

export default EstudioMedicoController;
