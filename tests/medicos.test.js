import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";

describe("GET /medicos", () => {
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

  it("Debería devolver una lista de médicos y status 200", async () => {
    const res = await request(app)
      .get("/medicos")
      .set('Cookie', `token=${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("LISTA DE MÉDICOS");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
}); 