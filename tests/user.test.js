const request = require("supertest");
const app = require("./../app");
const mongoose = require("mongoose");
const User = require("./../backend/models/User");
const jwt = require("jsonwebtoken");

let token;

beforeAll(async () => {
  const url = process.env.MONGO_URL;
  await mongoose.connect(url);

  const user = await User.create({
    username: "testuser",
    password: "password123",
  });
  token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("User API", () => {
  it("should get user profile", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("username", "testuser");
  });

  it("should update user profile", async () => {
    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "updateduser",
        password: "newpassword123",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "User updated successfully");
    expect(res.body.user).toHaveProperty("username", "updateduser");
  });
});
