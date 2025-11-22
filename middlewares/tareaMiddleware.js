import Tarea from "../models/TareaModel.js";

export const tareaMiddleware = {
  async loadTask(req, res, next) {
    try {
      const tarea = await Tarea.findById(req.params.id);

      if (!tarea) {
        return res.status(404).send("Tarea no encontrada");
      }

      res.locals.tarea = tarea;
      next();
    } catch (error) {
      console.error("Error cargando tarea:", error);
      return res.status(500).send("Error cargando tarea");
    }
  },

  canEditTask(req, res, next) {
    const { rol } = req.user;
    const tarea = res.locals.tarea;

    if (!tarea) return res.status(404).send("Tarea no encontrada");

    if (rol === "Administrador") return next();

    req.body = {
      estado: req.body.estado,
      observaciones: req.body.observaciones,
    };

    next();
  },
};
