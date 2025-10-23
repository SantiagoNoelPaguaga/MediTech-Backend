import express from "express";
import pacienteController from "../controllers/pacienteController.js";

const router = express.Router();

router.get("/", pacienteController.mostrarPacientes);

router.get("/new", pacienteController.formularioNuevoPaciente);
router.post("/new", pacienteController.guardarPaciente);

router.get("/edit/:id", pacienteController.formularioEditarPaciente);
router.put("/edit/:id", pacienteController.actualizarPaciente);

router.delete("/delete/:id", pacienteController.eliminarPaciente);

router.get("/buscar", pacienteController.buscarPorDniForm);

export default router;
