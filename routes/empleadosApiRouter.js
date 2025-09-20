import express from "express";
import empleadoApiController from "../controllers/empleadoApiController.js";

const router = express.Router();

router.get("/", empleadoApiController.getEmpleados);
router.post("/", empleadoApiController.postEmpleado);
router.put("/:id", empleadoApiController.putEmpleado);
router.delete("/:id", empleadoApiController.deleteEmpleado);

export default router;