const express = require("express");
const router = express.Router();
const { pullFromGacha } = require("../controllers/shopController.js");
const { protect } = require("../middleware/authMiddleware");

router.post("/pull/:category", protect, pullFromGacha);

module.exports = router;
