import express from "express";
import authController from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", authController.loginEmpleado);

router.get(
  "/cambiarPassword",
  authenticateToken,
  authController.formChangePassword,
);

router.post(
  "/cambiarPassword",
  authenticateToken,
  authController.changePassword,
);

router.get("/logout", authController.logout);

export default router;
