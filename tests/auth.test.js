const request = require("supertest");
const app = require("./../app");
const mongoose = require("mongoose");
const User = require("./../backend/models/User");

beforeAll(async () => {
  const url = process.env.MONGO_URI;
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  it("should login a user", async () => {
    await User.create({ username: "testuser", password: "password123" });
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});
