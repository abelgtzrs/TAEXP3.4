const express = require("express");
const router = express.Router();
const SnoopyArtBase = require("../models/SnoopyArtBase");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { protect, authorize } = require("../middleware/authMiddleware");

// Helper to generate a unique snoopyId from a name
async function generateUniqueSnoopyId(name) {
  const base = String(name || "snoopy")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  let candidate = base || "snoopy";
  let counter = 1;
  while (await SnoopyArtBase.findOne({ snoopyId: candidate })) {
    counter += 1;
    candidate = `${base}-${counter}`;
  }
  return candidate;
}

// GET /api/admin/snoopys - list all
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const items = await SnoopyArtBase.find({}).sort({ name: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching Snoopy items:", error);
    res.status(500).json({ success: false, message: "Error fetching Snoopy items" });
  }
});

// GET /api/admin/snoopys/:id - get one
router.get("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const item = await SnoopyArtBase.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching item" });
  }
});

// POST /api/admin/snoopys - create
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { name, imageUrl, description, rarity, snoopyId } = req.body;
    if (!name || !imageUrl) {
      return res.status(400).json({ success: false, message: "Name and imageUrl are required" });
    }
    let finalId = snoopyId;
    if (!finalId) {
      finalId = await generateUniqueSnoopyId(name);
    } else {
      const exists = await SnoopyArtBase.findOne({ snoopyId: finalId });
      if (exists) return res.status(400).json({ success: false, message: "snoopyId already exists" });
    }

    const created = await SnoopyArtBase.create({
      snoopyId: finalId,
      name,
      imageUrl,
      description: description || "",
      rarity: rarity || undefined, // defaults in schema
    });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("Error creating Snoopy:", error);
    res.status(500).json({ success: false, message: "Error creating Snoopy" });
  }
});

// PUT /api/admin/snoopys/:id - update
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { name, imageUrl, description, rarity } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (description !== undefined) updates.description = description;
    if (rarity !== undefined) updates.rarity = rarity;

    const updated = await SnoopyArtBase.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating Snoopy:", error);
    res.status(500).json({ success: false, message: "Error updating Snoopy" });
  }
});

// DELETE /api/admin/snoopys/:id - delete
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const existing = await SnoopyArtBase.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Not found" });
    await SnoopyArtBase.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Error deleting Snoopy:", error);
    res.status(500).json({ success: false, message: "Error deleting Snoopy" });
  }
});

module.exports = router;

// ---- Multer setup for image uploads ----
const uploadDir = path.join("public", "uploads", "snoopys");
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    console.error("Failed to create snoopy uploads directory:", e.message);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, gif, webp) are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } });

// POST /api/admin/snoopys/upload-image
router.post("/upload-image", protect, authorize("admin"), upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const urlPath = `/uploads/snoopys/${req.file.filename}`;
    return res.status(201).json({ success: true, url: urlPath, filename: req.file.filename });
  } catch (error) {
    console.error("Snoopy image upload error:", error);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});
