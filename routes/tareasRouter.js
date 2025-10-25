import express from "express";
import tareaController from "../controllers/tareaController.js";

const router = express.Router();

router.get("/", tareaController.mostrarTareas);

router.get("/filter", tareaController.filtrarTareas);

router.get("/new", tareaController.formularioNuevaTarea);
router.post("/new", tareaController.guardarTarea);

router.get("/edit/:id", tareaController.formularioEditarTarea);
router.put("/edit/:id", tareaController.actualizarTarea);

router.delete("/delete/:id", tareaController.eliminarTarea);

router.get("/api/empleado/dni/:dni", tareaController.apiBuscarEmpleado);
router.get("/api/paciente/dni/:dni", tareaController.apiBuscarPaciente);

export default router;
