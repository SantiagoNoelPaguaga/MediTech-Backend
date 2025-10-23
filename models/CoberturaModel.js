import mongoose from "mongoose";

const coberturaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

coberturaSchema.statics.obtenerTodas = async function () {
  return this.find().lean();
};

coberturaSchema.statics.buscarPorNombre = async function (nombre) {
  if (!nombre) throw new Error("Debe proporcionar un nombre de cobertura");
  return this.findOne({ nombre }).lean();
};

const Cobertura = mongoose.model("Cobertura", coberturaSchema);

export default Cobertura;
