import express from "express";
import empleadoController from "../controllers/empleadoController.js";

const router = express.Router();

router.get("/", empleadoController.mostrarEmpleados);

router.get("/new", empleadoController.formularioNuevoEmpleado);
router.post("/new", empleadoController.guardarEmpleado);

router.get("/edit/:id", empleadoController.formularioEditarEmpleado);
router.put("/edit/:id", empleadoController.actualizarEmpleado);

router.delete("/delete/:id", empleadoController.eliminarEmpleado);

export default router;
