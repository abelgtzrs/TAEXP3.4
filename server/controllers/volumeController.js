// server/controllers/volumeController.js

const Volume = require("../models/Volume"); // Import the Volume model
/*
 * --- The Parser Function ---
 * This helper function takes a block of raw text and parses it into a structured object.
 * @param {string} rawText - The full greentext pasted by the admin.
 * @returns {object} - A structured object ready to be saved as a Volume.
 */
const parseRawGreentext = (rawText) => {
  // Split text into lines. We trim later to preserve indentation info if needed, though current model doesn't use it.
  const lines = rawText.split("\n");
  const parsedData = {
    volumeNumber: null,
    title: "",
    bodyLines: [],
    blessingIntro: "",
    blessings: [],
    dream: "",
    edition: "",
  };

  // --- Define keywords to identify sections ---
  const BLESSING_INTRO_KEYWORD = "life is";
  const DREAM_KEYWORD = "the dream of";

  // --- Parse Volume and Title from the first line ---
  const titleRegex = /Volume\s+(\d+)\s*–\s*(.*)/i;
  const firstLineMatch = lines[0]?.trim().match(titleRegex);
  if (firstLineMatch) {
    parsedData.volumeNumber = parseInt(firstLineMatch[1], 10);
    parsedData.title = firstLineMatch[2].trim();
    // FIX for Edition: Set it reliably based on the title.
    parsedData.edition = `${parsedData.title} Edition`;
  }

  // --- Find the line indexes for our key sections ---
  const blessingIntroIndex = lines.findIndex((line) => line.trim().toLowerCase().startsWith(BLESSING_INTRO_KEYWORD));
  const dreamIndex = lines.findIndex((line) => line.trim().toLowerCase().startsWith(DREAM_KEYWORD));

  // --- NEW LOGIC for determining section boundaries ---
  // Find the first occurrence of any "special" section to mark the end of the body.
  const specialSectionIndexes = [blessingIntroIndex, dreamIndex].filter((index) => index !== -1);
  const bodyEndIndex = specialSectionIndexes.length > 0 ? Math.min(...specialSectionIndexes) : lines.length;

  // Body: Lines between title (line 0) and the start of the first special section.
  // We do NOT filter empty lines, as requested in the previous fix.
  parsedData.bodyLines = lines.slice(1, bodyEndIndex).map((line) => line.trimEnd()); // Trim only trailing whitespace

  // --- Blessing Parsing ---
  if (blessingIntroIndex !== -1) {
    parsedData.blessingIntro = lines[blessingIntroIndex].trim();
    const endOfBlessings = dreamIndex > blessingIntroIndex ? dreamIndex : lines.length;
    const blessingLines = lines.slice(blessingIntroIndex + 1, endOfBlessings).filter((line) => line.trim() !== "");

    const blessingRegex = /^(.*?)(?:\s*\((.*)\))?$/;
    for (const line of blessingLines) {
      const match = line.trim().match(blessingRegex);
      if (match) {
        parsedData.blessings.push({
          item: match[1].trim(),
          description: match[2] ? match[2].trim() : "",
        });
      }
    }
  }

  if (dreamIndex !== -1) {
    parsedData.dream = lines[dreamIndex].trim();
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
      return res.status(400).json({ success: false, message: "Raw text content is required." });
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
    const volumes = await Volume.find().populate("createdBy", "email").sort({ volumeNumber: -1 });
    res.status(200).json({ success: true, count: volumes.length, data: volumes });
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
      return res.status(404).json({ success: false, message: "Volume not found" });
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
      return res.status(404).json({ success: false, message: "Volume not found" });
    }
    res.status(200).json({ success: true, data: volume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Delete a volume
// @route   DELETE /api/admin/volumes/:id
exports.deleteVolume = async (req, res) => {
  try {
    const volume = await Volume.findById(req.params.id);
    if (!volume) {
      return res.status(404).json({ success: false, message: "Volume not found" });
    }
    await volume.remove();
    res.status(200).json({ success: true, message: "Volume deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
