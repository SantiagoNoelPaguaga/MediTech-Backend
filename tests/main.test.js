import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";

describe("Main Routes", () => {
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

  describe("GET /", () => {
    it("Debería redirigir a /index si el usuario está autenticado", async () => {
      const res = await request(app)
        .get("/")
        .set("Cookie", `token=${token}`);

      expect([200, 302]).toContain(res.statusCode);
    });

    it("Debería mostrar el formulario de login si el usuario no está autenticado", async () => {
      const res = await request(app).get("/");

      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /index", () => {
    it("Debería devolver la página principal y status 200", async () => {
      const res = await request(app)
        .get("/index")
        .set("Cookie", `token=${token}`);

      expect(res.statusCode).toBe(200);
    });

    it("Debería requerir autenticación", async () => {
      const res = await request(app).get("/index");

      expect([401, 302, 403]).toContain(res.statusCode);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

