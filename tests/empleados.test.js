import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";

describe("GET /empleados", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);

    token = jwt.sign(
      {
        id: "test-user-id",
        rol: "Medico",
      },
      process.env.SECRET,
      { expiresIn: "1h" },
    );
  });

  it("Debería devolver una lista de empleados y status 200", async () => {
    const res = await request(app)
      .get("/empleados")
      .set("Cookie", `token=${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("Debería requerir autenticación", async () => {
    const res = await request(app).get("/empleados");

    expect([401, 302, 403]).toContain(res.statusCode);
  });

  it("Debería requerir rol de Administrador", async () => {
    const userToken = jwt.sign(
      {
        id: "test-user-id",
        rol: "Empleado",
      },
      process.env.SECRET,
      { expiresIn: "1h" },
    );

    const res = await request(app)
      .get("/empleados")
      .set("Cookie", `token=${userToken}`);

    expect([403, 401]).toContain(res.statusCode);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

