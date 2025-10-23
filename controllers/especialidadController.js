import Especialidad from "../models/EspecialidadModel.js";

class EspecialidadController {
  static async obtenerEspecialidades() {
    try {
      const especialidades = await Especialidad.obtenerTodas();
      return especialidades;
    } catch (error) {
      console.error("Error al obtener especialidades:", error);
      throw new Error("No se pudieron obtener las especialidades");
    }
  }

  static async buscarEspecialidadPorNombre(nombre) {
    try {
      const especialidad = await Especialidad.buscarPorNombre(nombre);
      return especialidad;
    } catch (error) {
      console.error("Error al buscar especialidad:", error);
      throw new Error("No se pudo buscar la especialidad");
    }
  }
}

export default EspecialidadController;
