// server/controllers/strokesController.js
const StrokesSong = require("../models/StrokesSong");
const StrokesAlbum = require("../models/StrokesAlbum");

// @desc    Get a random Strokes song with its album info
// @route   GET /api/strokes/random
// @access  Public
exports.getRandomSong = async (req, res) => {
  try {
    // Use an aggregation pipeline to efficiently get a random document
    const randomSong = await StrokesSong.aggregate([{ $sample: { size: 1 } }]);

    if (!randomSong || randomSong.length === 0) {
      return res.status(404).json({ success: false, message: "No songs found in the database." });
    }

    // The result from aggregate is plain JSON, so we need to manually populate the album info
    await StrokesSong.populate(randomSong, { path: "album", model: StrokesAlbum });

    res.status(200).json({ success: true, data: randomSong[0] });
  } catch (error) {
    console.error("Error fetching random song:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
