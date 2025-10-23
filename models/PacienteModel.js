import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    cobertura: String,
    email: String,
    telefono: String,
    domicilio: String,
  },
  { timestamps: true }
);

pacienteSchema.statics.listar = async function (
  page = 1,
  perPage = 12,
  dni = ""
) {
  const filter = dni ? { dni: { $regex: dni, $options: "i" } } : {};
  const total = await this.countDocuments(filter);
  const totalPages = Math.ceil(total / perPage);

  const pacientes = await this.find(filter)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();

  return { pacientes, totalPages };
};

pacienteSchema.statics.crearPaciente = async function (data) {
  const paciente = new this(data);
  return paciente.save();
};

pacienteSchema.statics.obtenerPorId = async function (id) {
  return this.findById(id).lean();
};

pacienteSchema.statics.actualizarPaciente = async function (id, data) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

pacienteSchema.statics.eliminarPaciente = async function (id) {
  return this.findByIdAndDelete(id);
};

pacienteSchema.statics.obtenerPorDni = async function (dni) {
  if (!dni) throw new Error("Debe proporcionar un DNI");
  return this.findOne({ dni }).lean();
};

const Paciente = mongoose.model("Paciente", pacienteSchema);

export default Paciente;
