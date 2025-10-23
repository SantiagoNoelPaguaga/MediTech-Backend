import Cobertura from "../models/CoberturaModel.js";

class CoberturaController {
  static async obtenerCoberturas() {
    try {
      const coberturas = await Cobertura.obtenerTodas();
      return coberturas;
    } catch (error) {
      console.error("Error al obtener coberturas:", error);
      throw new Error("No se pudieron obtener las coberturas");
    }
  }

  static async buscarCoberturaPorNombre(nombre) {
    try {
      const cobertura = await Cobertura.buscarPorNombre(nombre);
      return cobertura;
    } catch (error) {
      console.error("Error al buscar cobertura:", error);
      throw new Error("No se pudo buscar la cobertura");
    }
  }
}

export default CoberturaController;
