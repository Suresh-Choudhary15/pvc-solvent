const express = require("express");
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require("./../controllers/itemController");
const { protect, admin } = require("./../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(getAllItems).post(protect, admin, createItem);

router
  .route("/:id")
  .get(getItemById)
  .put(protect, admin, updateItem)
  .delete(protect, admin, deleteItem);

module.exports = router;
