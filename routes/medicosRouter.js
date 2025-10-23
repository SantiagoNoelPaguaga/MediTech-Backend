import express from "express";
import medicoController from "../controllers/medicoController.js";

const router = express.Router();

router.get("/", medicoController.mostrarMedicos);

router.get("/new", medicoController.formularioNuevoMedico);
router.post("/new", medicoController.guardarMedico);

router.get("/edit/:id", medicoController.formularioEditarMedico);
router.put("/edit/:id", medicoController.actualizarMedico);

router.delete("/delete/:id", medicoController.eliminarMedico);

export default router;
