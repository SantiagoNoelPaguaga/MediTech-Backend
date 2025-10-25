import mongoose from "mongoose";

const EstadoTurnoEnum = ["PENDIENTE", "CONFIRMADO", "CANCELADO", "COMPLETADO"];

const turnoSchema = new mongoose.Schema(
  {
    fecha: {
      type: Date,
      required: true,
    },
    medicoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medico",
      required: true,
    },
    pacienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paciente",
      required: true,
    },
    tipoTurno: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      default: "No tiene descripcion aun.",
    },
    estado: {
      type: String,
      enum: EstadoTurnoEnum,
      default: "PENDIENTE",
      required: true,
    },
    dniPaciente: {
      type: String,
      required: true,
    },
    nombrePaciente: {
      type: String,
      required: true,
    },
    nombreMedico: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

turnoSchema.statics.listar = async function (
  page = 1,
  perPage = 12,
  dni = "",
  fecha = "",
) {
  let filter = dni ? { dniPaciente: { $regex: dni, $options: "i" } } : {};
  if (fecha) {
    const date = new Date(fecha);

    const startOfDay = date;
    const endOfDay = new Date(date);
    endOfDay.setDate(date.getDate() + 1);

    filter.fecha = {
      $gte: startOfDay,
      $lt: endOfDay,
    };
  }
  const total = await this.countDocuments(filter);
  const totalPages = Math.ceil(total / perPage);
  const turnos = await this.find(filter)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();

  return { turnos, totalPages };
};

turnoSchema.statics.crearTurno = async function (data) {
  const turno = new this(data);
  return turno.save();
};

turnoSchema.statics.obtenerPorId = async function (id) {
  return this.findById(id).lean();
};

turnoSchema.statics.actualizarTurno = async function (id, data) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

turnoSchema.statics.eliminarTurno = async function (id) {
  return this.findByIdAndDelete(id);
};

const Turno = mongoose.model("Turno", turnoSchema);

export default Turno;
