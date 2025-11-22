import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, (req, res) => {
  res.render("index", { titulo: "Inicio" });
});

export default router;
