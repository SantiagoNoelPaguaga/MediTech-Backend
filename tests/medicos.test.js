import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js'; 


describe('GET /medicos', () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  it('Debería devolver una lista de médicos y status 200', async () => {
    const res = await request(app).get('/medicos');
    expect(res.statusCode).toEqual(200);
    // Verificamos que la respuesta sea HTML
    expect(res.text).toContain('LISTA DE MÉDICOS');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});