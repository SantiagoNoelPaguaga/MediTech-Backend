import express from "express";
import medicoController from "../controllers/medicoController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRole("Administrador"),
  medicoController.mostrarMedicos,
);

router.get(
  "/new",
  authenticateToken,
  authorizeRole("Administrador"),
  medicoController.formularioNuevoMedico,
);

router.post(
  "/new",
  authenticateToken,
  authorizeRole("Administrador"),
  medicoController.guardarMedico,
);

router.get(
  "/edit/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  medicoController.formularioEditarMedico,
);

router.put(
  "/edit/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  medicoController.actualizarMedico,
);

router.delete(
  "/delete/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  medicoController.eliminarMedico,
);

export default router;
