import Turno from "../models/TurnoModel.js";

export const turnoMiddleware = {
  async loadTurno(req, res, next) {
    try {
      const turno = await Turno.obtenerPorId(req.params.id);

      if (!turno) {
        return res.status(404).send("Turno no encontrado");
      }

      res.locals.turno = turno;
      next();
    } catch (error) {
      console.error("Error cargando turno:", error);
      return res.status(500).send("Error cargando turno");
    }
  },

  canEditTurno(req, res, next) {
    const { rol } = req.user;
    const turno = res.locals.turno;

    if (!turno) return res.status(404).send("Turno no encontrado");

    if (rol === "Administrador") return next();

    req.body = {
      estado: req.body.estado,
      descripcion: req.body.descripcion,
    };

    next();
  },
};
