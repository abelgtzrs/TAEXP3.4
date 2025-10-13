const express = require("express");
const router = express.Router();
const { listPersonas, updatePersona } = require("../controllers/personaAdminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Protect all persona admin routes for admins
router.use(protect, authorize("admin"));

router.get("/", listPersonas);
router.put("/:id", updatePersona);

module.exports = router;
