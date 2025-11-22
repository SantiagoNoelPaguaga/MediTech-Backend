import express from "express";
import perfilController from "../controllers/perfilController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, perfilController.verPerfil);

router.get("/editar", authenticateToken, perfilController.formEditarPerfil);

router.post("/editar", authenticateToken, perfilController.actualizarPerfil);

export default router;
