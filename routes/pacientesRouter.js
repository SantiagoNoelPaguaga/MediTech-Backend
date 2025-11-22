import express from "express";
import pacienteController from "../controllers/pacienteController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRole("Administrador"),
  pacienteController.mostrarPacientes,
);

router.get(
  "/new",
  authenticateToken,
  authorizeRole("Administrador"),
  pacienteController.formularioNuevoPaciente,
);

router.post(
  "/new",
  authenticateToken,
  authorizeRole("Administrador"),
  pacienteController.guardarPaciente,
);

router.get(
  "/edit/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  pacienteController.formularioEditarPaciente,
);

router.put(
  "/edit/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  pacienteController.actualizarPaciente,
);

router.delete(
  "/delete/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  pacienteController.eliminarPaciente,
);

export default router;
