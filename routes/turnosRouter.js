import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorizeMiddleware.js";
import { turnoMiddleware } from "../middlewares/turnoMiddleware.js";
import turnoController from "../controllers/turnoController.js";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRole("Administrador", "Médico"),
  turnoController.mostrarTurnos,
);

router.get(
  "/new",
  authenticateToken,
  authorizeRole("Administrador"),
  turnoController.formularioNuevoTurno,
);

router.post(
  "/new",
  authenticateToken,
  authorizeRole("Administrador"),
  turnoController.guardarTurno,
);

router.get(
  "/edit/:id",
  authenticateToken,
  turnoMiddleware.loadTurno,
  turnoController.formularioEditarTurno,
);

router.put(
  "/edit/:id",
  authenticateToken,
  turnoMiddleware.loadTurno,
  turnoMiddleware.canEditTurno,
  turnoController.actualizarTurno,
);

router.delete(
  "/delete/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  turnoController.eliminarTurno,
);

router.get("/buscar", authenticateToken, turnoController.buscarPorIdForm);

router.get(
  "/paciente",
  authenticateToken,
  turnoController.buscarPacientePorIdForm,
);

router.get(
  "/api/medicos",
  authenticateToken,
  turnoController.obtenerMedicosAPI,
);

router.get(
  "/api/especialidades",
  authenticateToken,
  turnoController.obtenerEspecialidadesAPI,
);

router.get(
  "/api/tipo-turnos",
  authenticateToken,
  turnoController.obtenerTipoTurnosAPI,
);

router.get(
  "/api/estudios-medicos",
  authenticateToken,
  turnoController.obtenerEstudioMedicosAPI,
);

export default router;
