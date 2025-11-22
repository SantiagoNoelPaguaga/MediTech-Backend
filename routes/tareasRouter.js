import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorizeMiddleware.js";
import { tareaMiddleware } from "../middlewares/tareaMiddleware.js";
import tareaController from "../controllers/tareaController.js";

const router = express.Router();

router.get("/", authenticateToken, tareaController.mostrarTareas);

router.get("/filter", authenticateToken, tareaController.filtrarTareas);

router.get(
  "/new",
  authenticateToken,
  authorizeRole("Administrador"),
  tareaController.formularioNuevaTarea,
);

router.post(
  "/new",
  authenticateToken,
  authorizeRole("Administrador"),
  tareaController.guardarTarea,
);

router.get(
  "/edit/:id",
  authenticateToken,
  tareaMiddleware.loadTask,
  tareaController.formularioEditarTarea,
);

router.put(
  "/edit/:id",
  authenticateToken,
  tareaMiddleware.loadTask,
  tareaMiddleware.canEditTask,
  tareaController.actualizarTarea,
);

router.delete(
  "/delete/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  tareaController.eliminarTarea,
);

router.get(
  "/api/empleado/dni/:dni",
  authenticateToken,
  tareaController.apiBuscarEmpleado,
);
router.get(
  "/api/paciente/dni/:dni",
  authenticateToken,
  tareaController.apiBuscarPaciente,
);

export default router;
