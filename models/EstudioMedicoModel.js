import mongoose from "mongoose";

const estudioMedicoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    especialidades: [String],
  },
  {
    timestamps: true,
  },
);

estudioMedicoSchema.statics.obtenerTodos = async function () {
  return this.find().lean();
};

estudioMedicoSchema.statics.buscarPorEstudioMedicoId = async function (id) {
  return this.findById(id).lean();
};

const EstudioMedico = mongoose.model("EstudioMedico", estudioMedicoSchema);

export default EstudioMedico;
