import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";

describe("Turnos Routes", () => {
  let adminToken;
  let medicoToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);

    adminToken = jwt.sign(
      {
        id: "test-admin-id",
        rol: "Administrador",
      },
      process.env.SECRET,
      { expiresIn: "1h" },
    );

    medicoToken = jwt.sign(
      {
        id: "test-medico-id",
        rol: "Médico",
      },
      process.env.SECRET,
      { expiresIn: "1h" },
    );
  });

  describe("GET /turnos", () => {
    it("Debería devolver una lista de turnos y status 200 para Administrador", async () => {
      const res = await request(app)
        .get("/turnos")
        .set("Cookie", `token=${adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it("Debería devolver una lista de turnos y status 200 para Médico", async () => {
      const res = await request(app)
        .get("/turnos")
        .set("Cookie", `token=${medicoToken}`);

      expect(res.statusCode).toBe(200);
    });

    it("Debería requerir autenticación", async () => {
      const res = await request(app).get("/turnos");

      expect([401, 302, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /turnos/buscar", () => {
    it("Debería devolver el formulario de búsqueda y status 200", async () => {
      const res = await request(app)
        .get("/turnos/buscar")
        .set("Cookie", `token=${adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /turnos/paciente", () => {
    it("Debería devolver el formulario de búsqueda por paciente y status 200", async () => {
      const res = await request(app)
        .get("/turnos/paciente")
        .set("Cookie", `token=${adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /turnos/api/medicos", () => {
    it("Debería devolver la lista de médicos en formato JSON y status 200", async () => {
      const res = await request(app)
        .get("/turnos/api/medicos")
        .set("Cookie", `token=${adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /turnos/api/especialidades", () => {
    it("Debería devolver la lista de especialidades en formato JSON y status 200", async () => {
      const res = await request(app)
        .get("/turnos/api/especialidades")
        .set("Cookie", `token=${adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

