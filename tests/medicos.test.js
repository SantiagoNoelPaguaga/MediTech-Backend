import { jest } from '@jest/globals';

const mockAuthMiddleware = (req, res, next) => next();

const mockHandler = (req, res) => {
  res.status(200).send('<h1>VISTA MOCKEADA</h1>');
};

jest.unstable_mockModule('../middlewares/authMiddleware.js', () => ({
  __esModule: true,
  authenticateToken: mockAuthMiddleware,
  default: mockAuthMiddleware,
}));

const mockController = {
  mostrarMedicos: mockHandler,
  formularioNuevoMedico: mockHandler,
  guardarMedico: mockHandler,
  formularioEditarMedico: mockHandler,
  actualizarMedico: mockHandler,
  eliminarMedico: mockHandler
};

jest.unstable_mockModule('../controllers/medicoController.js', () => ({
  __esModule: true,
  ...mockController,
  default: mockController
}));

const request = (await import('supertest')).default;
const app = (await import('../app.js')).default;

describe('GET /medicos', () => {
  it('Debería devolver status 200 al acceder a la ruta', async () => {
    const res = await request(app).get('/medicos');

    if (res.statusCode !== 200) {
      console.error('Status:', res.statusCode);
      console.error('Error:', res.text);
    }

    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('VISTA MOCKEADA');
  });
});
