import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";

describe("Auth Routes", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);

    token = jwt.sign(
      {
        id: "test-user-id",
        rol: "Administrador",
      },
      process.env.SECRET,
      { expiresIn: "1h" },
    );
  });

  describe("GET /auth/cambiarPassword", () => {
    it("Debería devolver el formulario de cambio de contraseña y status 200", async () => {
      const res = await request(app)
        .get("/auth/cambiarPassword")
        .set("Cookie", `token=${token}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /auth/logout", () => {
    it("Debería cerrar sesión y redirigir al login", async () => {
      const res = await request(app)
        .get("/auth/logout")
        .set("Cookie", `token=${token}`);

      expect([200, 302]).toContain(res.statusCode);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

