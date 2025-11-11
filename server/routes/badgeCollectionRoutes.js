// server/routes/badgeCollectionRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  listCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/badgeCollectionController");

// Admin only routes
router.use(protect, authorize("admin"));

router.get("/", listCollections);
router.get("/:key", getCollection);
router.post("/", createCollection);
router.put("/:key", updateCollection);
router.delete("/:key", deleteCollection);

module.exports = router;
