import mongoose from "mongoose";

const tipoTurnoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

tipoTurnoSchema.statics.obtenerTipoTurnos = async function () {
    return this.find().lean();
};

tipoTurnoSchema.statics.obtenerTipoTurno = async function (id) {
    if (!id) {
        throw new Error("Debe proporcionar un ID de Tipo de Turno.");
    }
    return this.findById(id).lean();
};

const TipoTurno = mongoose.model('TipoTurno', tipoTurnoSchema);

export default TipoTurno