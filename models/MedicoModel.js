import mongoose from "mongoose";

const medicoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    matricula: { type: String, required: true, unique: true },
    dni: { type: String, required: true, unique: true },
    telefono: String,
    email: String,
    domicilio: String,
    especialidades: [String],
  },
  { timestamps: true }
);

medicoSchema.statics.listar = async function (
  page = 1,
  perPage = 12,
  dni = ""
) {
  const filter = dni ? { dni: { $regex: dni, $options: "i" } } : {};
  const total = await this.countDocuments(filter);
  const totalPages = Math.ceil(total / perPage);
  const medicos = await this.find(filter)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();
  return { medicos, totalPages };
};

medicoSchema.statics.crearMedico = async function (data) {
  const medico = new this(data);
  return medico.save();
};

medicoSchema.statics.obtenerPorId = async function (id) {
  return this.findById(id).lean();
};

medicoSchema.statics.actualizarMedico = async function (id, data) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

medicoSchema.statics.eliminarMedico = async function (id) {
  return this.findByIdAndDelete(id);
};

const Medico = mongoose.model("Medico", medicoSchema);

export default Medico;
