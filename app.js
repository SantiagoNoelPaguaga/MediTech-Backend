import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import empleadosRouter from './routes/empleadosRouter.js'; 
import apiEmpleadosRouter from "./routes/empleadosApiRouter.js";
import tareasRouter from './routes/tareasRouter.js'; 
import apiTareasRouter from './routes/tareasApiRouter.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(methodOverride('_method')); 

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.redirect('/tareas');
});

app.use('/empleados', empleadosRouter);
app.use("/api/empleados", apiEmpleadosRouter);
app.use('/tareas', tareasRouter); 
app.use('/api/tareas', apiTareasRouter);

app.listen(3000, () => console.log('Servidor en http://localhost:3000/'));
