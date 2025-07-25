const express = require("express");
const router = express.Router();
const HabboRareBase = require("../models/HabboRareBase");
const { protect, authorize } = require("../middleware/authMiddleware");

// @desc    Get all Habbo Rares for admin
// @route   GET /api/admin/habbo-rares
// @access  Private/Admin
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const habboRares = await HabboRareBase.find().sort({ name: 1 });
    res.json(habboRares);
  } catch (error) {
    console.error("Error fetching Habbo Rares:", error);
    res.status(500).json({
      message: "Error fetching Habbo Rares",
      error: error.message,
    });
  }
});

// @desc    Get single Habbo Rare by ID
// @route   GET /api/admin/habbo-rares/:id
// @access  Private/Admin
router.get("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const habboRare = await HabboRareBase.findById(req.params.id);

    if (!habboRare) {
      return res.status(404).json({ message: "Habbo Rare not found" });
    }

    res.json(habboRare);
  } catch (error) {
    console.error("Error fetching Habbo Rare:", error);
    res.status(500).json({
      message: "Error fetching Habbo Rare",
      error: error.message,
    });
  }
});

// @desc    Update Habbo Rare
// @route   PUT /api/admin/habbo-rares/:id
// @access  Private/Admin
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { name, description, rarity, category, imageUrl, tags, isActive } = req.body;

    const habboRare = await HabboRareBase.findById(req.params.id);

    if (!habboRare) {
      return res.status(404).json({ message: "Habbo Rare not found" });
    }

    // Update fields
    if (name !== undefined) habboRare.name = name;
    if (description !== undefined) habboRare.description = description;
    if (rarity !== undefined) habboRare.rarity = rarity;
    if (category !== undefined) habboRare.category = category;
    if (imageUrl !== undefined) habboRare.imageUrl = imageUrl;
    if (tags !== undefined) habboRare.tags = tags;
    if (isActive !== undefined) habboRare.isActive = isActive;

    // Update timestamp
    habboRare.updatedAt = new Date();

    const updatedHabboRare = await habboRare.save();

    res.json(updatedHabboRare);
  } catch (error) {
    console.error("Error updating Habbo Rare:", error);
    res.status(500).json({
      message: "Error updating Habbo Rare",
      error: error.message,
    });
  }
});

// @desc    Create new Habbo Rare
// @route   POST /api/admin/habbo-rares
// @access  Private/Admin
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { name, description, rarity, category, imageUrl, tags, isActive } = req.body;

    // Check if Habbo Rare with same name already exists
    const existingRare = await HabboRareBase.findOne({ name });
    if (existingRare) {
      return res.status(400).json({ message: "Habbo Rare with this name already exists" });
    }

    const habboRare = new HabboRareBase({
      name,
      description,
      rarity,
      category,
      imageUrl,
      tags: tags || [],
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedHabboRare = await habboRare.save();

    res.status(201).json(savedHabboRare);
  } catch (error) {
    console.error("Error creating Habbo Rare:", error);
    res.status(500).json({
      message: "Error creating Habbo Rare",
      error: error.message,
    });
  }
});

// @desc    Delete Habbo Rare
// @route   DELETE /api/admin/habbo-rares/:id
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const habboRare = await HabboRareBase.findById(req.params.id);

    if (!habboRare) {
      return res.status(404).json({ message: "Habbo Rare not found" });
    }

    await HabboRareBase.findByIdAndDelete(req.params.id);

    res.json({ message: "Habbo Rare deleted successfully" });
  } catch (error) {
    console.error("Error deleting Habbo Rare:", error);
    res.status(500).json({
      message: "Error deleting Habbo Rare",
      error: error.message,
    });
  }
});

// @desc    Test image URL accessibility
// @route   POST /api/admin/habbo-rares/test-image
// @access  Private/Admin
router.post("/test-image", protect, authorize("admin"), async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    // Construct full URL if relative path
    let fullUrl = imageUrl;
    if (!imageUrl.startsWith("http")) {
      fullUrl = `${req.protocol}://${req.get("host")}/${imageUrl}`;
    }

    // Test if image is accessible
    const https = require("https");
    const http = require("http");
    const client = fullUrl.startsWith("https") ? https : http;

    const testPromise = new Promise((resolve, reject) => {
      const request = client
        .get(fullUrl, (response) => {
          if (response.statusCode === 200) {
            resolve({
              accessible: true,
              statusCode: response.statusCode,
              contentType: response.headers["content-type"],
              contentLength: response.headers["content-length"],
            });
          } else {
            resolve({
              accessible: false,
              statusCode: response.statusCode,
              error: `HTTP ${response.statusCode}`,
            });
          }
        })
        .on("error", (error) => {
          resolve({
            accessible: false,
            error: error.message,
          });
        });

      // Set timeout
      request.setTimeout(5000, () => {
        request.destroy();
        resolve({
          accessible: false,
          error: "Request timeout",
        });
      });
    });

    const result = await testPromise;

    res.json({
      imageUrl,
      fullUrl,
      ...result,
    });
  } catch (error) {
    console.error("Error testing image URL:", error);
    res.status(500).json({
      message: "Error testing image URL",
      error: error.message,
    });
  }
});

// @desc    Bulk update Habbo Rares
// @route   PUT /api/admin/habbo-rares/bulk
// @access  Private/Admin
router.put("/bulk", protect, authorize("admin"), async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, ...updateFields }

    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: "Updates must be an array" });
    }

    const results = [];

    for (const update of updates) {
      try {
        const { id, ...updateFields } = update;

        const habboRare = await HabboRareBase.findByIdAndUpdate(
          id,
          { ...updateFields, updatedAt: new Date() },
          { new: true, runValidators: true }
        );

        if (habboRare) {
          results.push({ id, success: true, data: habboRare });
        } else {
          results.push({ id, success: false, error: "Not found" });
        }
      } catch (error) {
        results.push({ id: update.id, success: false, error: error.message });
      }
    }

    res.json({
      message: "Bulk update completed",
      results,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    });
  } catch (error) {
    console.error("Error in bulk update:", error);
    res.status(500).json({
      message: "Error in bulk update",
      error: error.message,
    });
  }
});

module.exports = router;
