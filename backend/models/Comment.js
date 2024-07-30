const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
