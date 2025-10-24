import TipoTurno from "../models/TipoTurno.js";

class TipoTurnoController {
  static async obtenerTipoTurnos() {
    try {
      const tipoTurnos = await TipoTurno.obtenerTipoTurnos();
      return tipoTurnos;
    } catch (error) {
      console.error("Error al obtener tipo de turnos:", error);
      throw new Error("No se pudieron obtener los tipo de turnos");
    }
  }

  static async buscarTipoTurnoPorId(id) {
    try {
      const tipoTurno = await TipoTurno.obtenerTipoTurno(id);
      return tipoTurno;
    } catch (error) {
      console.error("Error al buscar tipo de turno:", error);
      throw new Error("No se pudo buscar el tipo de turno");
    }
  }
}

export default TipoTurnoController;
