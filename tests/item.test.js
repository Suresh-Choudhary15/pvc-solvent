const request = require("supertest");
const app = require("./../app");
const mongoose = require("mongoose");
const Item = require("./../backend/models/Item");
const User = require("./../backend/models/User");
const jwt = require("jsonwebtoken");

let token;

beforeAll(async () => {
  const url = process.env.MONGO_URL;
  await mongoose.connect(url);

  const user = await User.create({
    username: "admin",
    password: "password123",
    isAdmin: true,
  });
  token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "secret", {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Item API", () => {
  it("should create an item", async () => {
    const res = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Item",
        quantity: 10,
        price: 19.99,
        description: "This is a test item.",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Item created successfully");
  });

  it("should get all items", async () => {
    const res = await request(app).get("/api/items");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get an item by ID", async () => {
    const item = await Item.create({
      name: "Test Item",
      quantity: 10,
      price: 19.99,
      description: "This is a test item.",
    });
    const res = await request(app).get(`/api/items/${item._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", "Test Item");
  });

  it("should update an item", async () => {
    const item = await Item.create({
      name: "Test Item",
      quantity: 10,
      price: 19.99,
      description: "This is a test item.",
    });
    const res = await request(app)
      .put(`/api/items/${item._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Item",
        quantity: 20,
        price: 29.99,
        description: "This is an updated test item.",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Item updated successfully");
    expect(res.body.item).toHaveProperty("name", "Updated Item");
  });

  it("should delete an item", async () => {
    const item = await Item.create({
      name: "Test Item",
      quantity: 10,
      price: 19.99,
      description: "This is a test item.",
    });
    const res = await request(app)
      .delete(`/api/items/${item._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Item deleted successfully");
  });
});
