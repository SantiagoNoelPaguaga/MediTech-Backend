import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import mainRouter from "./routes/mainRouter.js";
import empleadosRouter from "./routes/empleadosRouter.js";
import tareasRouter from "./routes/tareasRouter.js";
import pacientesRouter from "./routes/pacientesRouter.js";
import medicosRouter from "./routes/medicosRouter.js";
import turnosRouter from "./routes/turnosRouter.js";
import authRouter from "./routes/authRouter.js";
import perfilRouter from "./routes/perfilRouter.js";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbURI = process.env.NODE_ENV === 'test' 
  ? process.env.MONGO_URI_TEST 
  : process.env.MONGO_URI;

  if (process.env.NODE_ENV !== 'test') {
    mongoose
      .connect(dbURI)
      .then(() => console.log("Conectado a MongoDB Atlas"))
      .catch((err) => console.error("Error conectando a MongoDB:", err));
  }

app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.locals.user = null;

  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET);
      res.locals.user = decoded;
    }
  } catch (e) {}

  next();
});
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  }),
);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("auth/login");
});

app.use("/auth", authRouter);
app.use("/perfil", perfilRouter);
app.use("/index", mainRouter);
app.use("/tareas", tareasRouter);
app.use("/empleados", empleadosRouter);
app.use("/pacientes", pacientesRouter);
app.use("/medicos", medicosRouter);
app.use("/turnos", turnosRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}/`));
}
export default app;
