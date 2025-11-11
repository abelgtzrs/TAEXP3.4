const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

const {
  listBadgesByCollection,
  createBadge,
  updateBadge,
  deleteBadge,
} = require("../controllers/badgeAdminController");
const {
  listCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/badgeCollectionController");

// Multer storage for badge sprites
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/badges"));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Admin only
router.use(protect, authorize("admin"));

router.get("/collections", listCollections);
router.post("/collections", createCollection);
router.put("/collections/:key", updateCollection);
router.delete("/collections/:key", deleteCollection);
router.get("/collections/:collectionKey", listBadgesByCollection);
router.post(
  "/badges",
  upload.fields([
    { name: "small", maxCount: 1 },
    { name: "large", maxCount: 1 },
  ]),
  createBadge
);
router.put(
  "/badges/:badgeId",
  upload.fields([
    { name: "small", maxCount: 1 },
    { name: "large", maxCount: 1 },
  ]),
  updateBadge
);
router.delete("/badges/:badgeId", deleteBadge);

module.exports = router;
