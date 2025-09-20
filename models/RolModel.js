import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaArchivo = path.join(__dirname, '../data/roles.json');

class RolModel {
  static async obtenerRoles() {
    try {
      const data = await fs.promises.readFile(rutaArchivo, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }
}

export default RolModel;