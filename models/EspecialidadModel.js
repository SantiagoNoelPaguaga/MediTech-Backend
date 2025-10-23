import mongoose from "mongoose";

const especialidadSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

especialidadSchema.statics.obtenerTodas = async function () {
  return this.find().lean();
};

especialidadSchema.statics.buscarPorNombre = async function (nombre) {
  if (!nombre) throw new Error("Debe proporcionar un nombre de especialidad");
  return this.findOne({ nombre }).lean();
};

const Especialidad = mongoose.model("Especialidad", especialidadSchema);

export default Especialidad;
