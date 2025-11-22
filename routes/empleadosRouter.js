import express from "express";
import empleadoController from "../controllers/empleadoController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRole("Administrador"),
  empleadoController.mostrarEmpleados,
);

router.get(
  "/new",
  authenticateToken,
  authorizeRole("Administrador"),
  empleadoController.formularioNuevoEmpleado,
);

router.post(
  "/new",
  authenticateToken,
  authorizeRole("Administrador"),
  empleadoController.guardarEmpleado,
);

router.get(
  "/edit/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  empleadoController.formularioEditarEmpleado,
);

router.put(
  "/edit/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  empleadoController.actualizarEmpleado,
);

router.delete(
  "/delete/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  empleadoController.eliminarEmpleado,
);

export default router;
