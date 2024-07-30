const request = require("supertest");
const app = require("./../app");
const mongoose = require("mongoose");
const Comment = require("./../backend/models/Comment");
const Item = require("./../backend/models/Item");
const User = require("./../backend/models/User");
const jwt = require("jsonwebtoken");

let token;
let itemId;

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

  const item = await Item.create({
    name: "Test Item",
    quantity: 10,
    price: 19.99,
    description: "This is a test item.",
  });
  itemId = item._id;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Comment API", () => {
  it("should create a comment", async () => {
    const res = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        itemId,
        content: "This is a test comment.",
        rating: 5,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Comment added successfully");
  });

  it("should get comments for an item", async () => {
    const res = await request(app).get(`/api/comments/${itemId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should delete a comment", async () => {
    const comment = await Comment.create({
      itemId,
      userId: mongoose.Types.ObjectId(),
      content: "This is a test comment to delete.",
      rating: 3,
    });
    const res = await request(app)
      .delete(`/api/comments/${comment._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Comment deleted successfully");
  });
});
