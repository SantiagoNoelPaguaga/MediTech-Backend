import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String },

    estado: {
      type: String,
      enum: ["PENDIENTE", "EN CURSO", "COMPLETADA", "CANCELADA"],
      default: "PENDIENTE",
      required: true,
    },

    prioridad: {
      type: String,
      enum: ["BAJA", "MEDIA", "ALTA"],
      default: "MEDIA",
      required: true,
    },

    area: { type: String, required: true },

    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
    },

    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paciente",
      required: false,
    },

    proveedor: {
      type: String,
      enum: [
        "Distribuidora Médica Sur",
        "Farmalab",
        "ProveSalud",
        "BioTech",
        "Medimport",
        "Otro",
      ],
      required: false,
    },

    observaciones: { type: String, required: false },

    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
  },
  { timestamps: true },
);

tareaSchema.statics.listar = async function (
  page = 1,
  perPage = 10,
  filtros = {},
) {
  const filter = {};

  if (filtros.estado) filter.estado = filtros.estado;
  if (filtros.prioridad) filter.prioridad = filtros.prioridad;
  if (filtros.area) filter.area = filtros.area;
  if (filtros.empleado) filter.empleado = filtros.empleado;
  if (filtros.paciente) filter.paciente = filtros.paciente;
  if (filtros.proveedor) filter.proveedor = filtros.proveedor;

  const total = await this.countDocuments(filter);
  const totalPages = Math.ceil(total / perPage);

  const tareas = await this.find(filter)
    .populate("empleado", "nombre apellido dni rol area")
    .populate("paciente", "nombre apellido dni")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();

  return { tareas, totalPages };
};

tareaSchema.statics.listarPorEmpleado = async function (
  empleadoId,
  page = 1,
  perPage = 10,
  filtros = {},
) {
  const filter = { empleado: empleadoId };

  if (filtros.estado) filter.estado = filtros.estado;
  if (filtros.prioridad) filter.prioridad = filtros.prioridad;

  const total = await this.countDocuments(filter);
  const totalPages = Math.ceil(total / perPage);

  const tareas = await this.find(filter)
    .populate("empleado", "nombre apellido dni rol area")
    .populate("paciente", "nombre apellido dni")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();

  return { tareas, totalPages };
};

tareaSchema.statics.crearTarea = async function (data) {
  const tarea = new this(data);
  return tarea.save();
};

tareaSchema.statics.obtenerPorId = async function (id) {
  return this.findById(id)
    .populate("empleado", "nombre apellido dni rol area")
    .populate("paciente", "nombre apellido dni")
    .lean();
};

tareaSchema.statics.actualizarTarea = async function (id, data) {
  return this.findByIdAndUpdate(id, data, { new: true })
    .populate("empleado", "nombre apellido dni area")
    .populate("paciente", "nombre apellido dni")
    .lean();
};

tareaSchema.statics.eliminarTarea = async function (id) {
  return this.findByIdAndDelete(id);
};

tareaSchema.statics.filtrarTareas = async function (filtros = {}) {
  const filter = {};

  if (filtros.estado) filter.estado = filtros.estado;
  if (filtros.prioridad) filter.prioridad = filtros.prioridad;
  if (filtros.area) filter.area = filtros.area;
  if (filtros.proveedor) filter.proveedor = filtros.proveedor;
  if (filtros.fechaInicio)
    filter.fechaInicio = { $gte: new Date(filtros.fechaInicio) };
  if (filtros.fechaFin) filter.fechaFin = { $lte: new Date(filtros.fechaFin) };

  const tareas = await this.find(filter)
    .populate({
      path: "empleado",
      select: "nombre apellido dni area",
      match: filtros.dni ? { dni: filtros.dni } : {},
    })
    .populate({
      path: "paciente",
      select: "nombre apellido dni",
      match: filtros.dni ? { dni: filtros.dni } : {},
    })
    .lean();

  if (filtros.dni) {
    return tareas.filter((t) => t.empleado || t.paciente);
  }

  return tareas;
};

const Tarea = mongoose.model("Tarea", tareaSchema);

export default Tarea;
