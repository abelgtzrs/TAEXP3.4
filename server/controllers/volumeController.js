// server/controllers/volumeController.js

const Volume = require("../models/Volumes"); // Import the Volume model

/**
 * --- The Parser Function ---
 * This helper function takes a block of raw text and parses it into a structured object.
 * @param {string} rawText - The full greentext pasted by the admin.
 * @returns {object} - A structured object ready to be saved as a Volume.
 */
const parseRawGreentext = (rawText) => {
  const lines = rawText.split("\n").map((line) => line.trim()); // Split by line and trim whitespace.
  const parsedData = {
    volumeNumber: null,
    title: "",
    bodyLines: [],
    blessingIntro: "",
    blessings: [],
    dream: "",
    edition: "",
  };

  // Define keywords to identify sections.
  const BLESSING_INTRO_KEYWORD = "life is";
  const DREAM_KEYWORD = "the dream of";
  const EDITION_KEYWORD = "Edition";

  // Regex to parse Title line: e.g., "The Abel Experience™: Volume 196 – Cybertruck Combat..."
  const titleRegex = /Volume\s+(\d+)\s*–\s*(.*)/i;
  const firstLineMatch = lines[0] ? lines[0].match(titleRegex) : null;
  if (firstLineMatch) {
    parsedData.volumeNumber = parseInt(firstLineMatch[1], 10);
    parsedData.title = firstLineMatch[2].trim();
  }

  // Find the line indexes for our key sections.
  const blessingIntroIndex = lines.findIndex((line) =>
    line.toLowerCase().startsWith(BLESSING_INTRO_KEYWORD)
  );
  const dreamIndex = lines.findIndex((line) =>
    line.toLowerCase().startsWith(DREAM_KEYWORD)
  );
  const editionIndex = lines.findIndex((line) =>
    line.endsWith(EDITION_KEYWORD)
  ); // Find the final edition line

  // --- Populate the sections based on indexes ---

  // Body: Lines between title (line 0) and the blessing intro.
  if (blessingIntroIndex !== -1) {
    parsedData.bodyLines = lines
      .slice(1, blessingIntroIndex)
      .filter((line) => line !== "");
  }

  // Blessing Intro
  if (blessingIntroIndex !== -1) {
    parsedData.blessingIntro = lines[blessingIntroIndex];
  }

  // Blessings: Lines between the blessing intro and the dream line.
  if (blessingIntroIndex !== -1 && dreamIndex !== -1) {
    const blessingLines = lines
      .slice(blessingIntroIndex + 1, dreamIndex)
      .filter((line) => line !== "");

    // Regex to parse each blessing item: e.g., "The Strokes (description...)"
    const blessingRegex = /^(.*?)(?:\s*\((.*)\))?$/;
    for (const line of blessingLines) {
      const match = line.match(blessingRegex);
      if (match) {
        parsedData.blessings.push({
          item: match[1].trim(),
          description: match[2] ? match[2].trim() : "", // Handle blessings with no description
        });
      }
    }
  }

  // Dream
  if (dreamIndex !== -1) {
    parsedData.dream = lines[dreamIndex];
  }

  // Edition
  if (editionIndex !== -1) {
    // Example: "The Abel Experience™: Cybertruck... Edition" -> "Cybertruck... Edition"
    parsedData.edition = lines[editionIndex].split(":")[1]?.trim() || "";
  }

  return parsedData;
};

// --- Controller Functions ---

// @desc    Create a Volume from raw text
// @route   POST /api/admin/volumes
exports.createVolumeFromRaw = async (req, res) => {
  try {
    const { rawPastedText, status } = req.body;
    if (!rawPastedText) {
      return res
        .status(400)
        .json({ success: false, message: "Raw text content is required." });
    }

    // Parse the raw text into our structured format.
    const parsedData = parseRawGreentext(rawPastedText);

    if (!parsedData.volumeNumber || !parsedData.title) {
      return res.status(400).json({
        success: false,
        message: "Failed to parse Volume number and Title from text.",
      });
    }

    // Create the new volume in the database.
    const volume = await Volume.create({
      ...parsedData, // Spread all the parsed fields
      rawPastedText, // Also save the original text
      status: status || "draft", // Allow setting status on creation, default to draft
      createdBy: req.user.id, // Link to the admin user who created it
    });

    res.status(201).json({ success: true, data: volume });
  } catch (error) {
    console.error("Create Volume Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error creating volume",
      error: error.message,
    });
  }
};

// --- Other standard CRUD functions ---

// @desc    Get all volumes for the admin dashboard
// @route   GET /api/admin/volumes
exports.getAllVolumesForAdmin = async (req, res) => {
  try {
    const volumes = await Volume.find()
      .populate("createdBy", "email")
      .sort({ volumeNumber: -1 });
    res
      .status(200)
      .json({ success: true, count: volumes.length, data: volumes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get a single volume by ID for admin
// @route   GET /api/admin/volumes/:id
exports.getVolumeByIdForAdmin = async (req, res) => {
  try {
    const volume = await Volume.findById(req.params.id);
    if (!volume) {
      return res
        .status(404)
        .json({ success: false, message: "Volume not found" });
    }
    res.status(200).json({ success: true, data: volume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update a volume (can re-parse raw text or update specific fields)
// @route   PUT /api/admin/volumes/:id
exports.updateVolumeFromRaw = async (req, res) => {
  try {
    let updateData = req.body;
    // If the admin sends updated raw text, we re-parse it.
    if (req.body.rawPastedText) {
      const parsedData = parseRawGreentext(req.body.rawPastedText);
      updateData = { ...req.body, ...parsedData };
    }

    const volume = await Volume.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!volume) {
      return res
        .status(404)
        .json({ success: false, message: "Volume not found" });
    }
    res.status(200).json({ success: true, data: volume });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Delete a volume
// @route   DELETE /api/admin/volumes/:id
exports.deleteVolume = async (req, res) => {
  try {
    const volume = await Volume.findById(req.params.id);
    if (!volume) {
      return res
        .status(404)
        .json({ success: false, message: "Volume not found" });
    }
    await volume.remove();
    res
      .status(200)
      .json({ success: true, message: "Volume deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
