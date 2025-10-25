import mongoose from "mongoose";

const ROLES = [
  "Administrador",
  "Médico",
  "Recepcionista",
  "Encargado de Stock",
];
const AREAS = [
  "Administración de Turnos",
  "Atención Médica",
  "Gestión de Insumos Médicos",
  "Facturación",
];

const empleadoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    rol: { type: String, required: true, enum: ROLES },
    area: { type: String, required: true, enum: AREAS },
  },
  { timestamps: true },
);

empleadoSchema.statics.listar = async function (
  page = 1,
  perPage = 12,
  dni = "",
) {
  const filter = dni ? { dni: { $regex: dni, $options: "i" } } : {};
  const total = await this.countDocuments(filter);
  const totalPages = Math.ceil(total / perPage);

  const empleados = await this.find(filter)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();

  return { empleados, totalPages };
};

empleadoSchema.statics.crearEmpleado = async function (data) {
  const empleado = new this(data);
  return empleado.save();
};

empleadoSchema.statics.obtenerPorId = async function (id) {
  return this.findById(id).lean();
};

empleadoSchema.statics.actualizarEmpleado = async function (id, data) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

empleadoSchema.statics.eliminarEmpleado = async function (id) {
  return this.findByIdAndDelete(id);
};

empleadoSchema.statics.obtenerPorDni = async function (dni) {
  return this.findOne({ dni }).lean();
};

empleadoSchema.statics.obtenerRoles = function () {
  return ROLES;
};

empleadoSchema.statics.obtenerAreas = function () {
  return AREAS;
};

const Empleado = mongoose.model("Empleado", empleadoSchema);

export default Empleado;
