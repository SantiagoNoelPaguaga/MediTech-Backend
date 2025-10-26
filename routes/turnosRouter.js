import express from "express";
import turnoController from "../controllers/turnoController.js";

const router = express.Router();

router.get("/", turnoController.mostrarTurnos);

router.get("/new", turnoController.formularioNuevoTurno);
router.post("/new", turnoController.guardarTurno);

router.get("/edit/:id", turnoController.formularioEditarTurno);
router.put("/edit/:id", turnoController.actualizarTurno);

router.delete("/delete/:id", turnoController.eliminarTurno);

router.get("/buscar", turnoController.buscarPorIdForm);

router.get("/paciente", turnoController.buscarPacientePorIdForm);

router.get("/api/medicos", turnoController.obtenerMedicosAPI);

router.get("/api/especialidades", turnoController.obtenerEspecialidadesAPI);

router.get("/api/tipo-turnos", turnoController.obtenerTipoTurnosAPI);

router.get("/api/estudios-medicos", turnoController.obtenerEstudioMedicosAPI);

export default router;
