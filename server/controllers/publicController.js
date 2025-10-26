const Volume = require("../models/Volume");

function dayOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

exports.favoriteVolume = async (req, res) => {
  try {
    const volume = await Volume.findOne({
      volumeNumber: req.params.volumeNumber,
      status: "published",
    });
    if (!volume) {
      return res.status(404).json({ success: false, message: "Volume not found." });
    }
    // Increment the favorite count and save.
    volume.favoriteCount = (volume.favoriteCount || 0) + 1;
    await volume.save();
    res.status(200).json({
      success: true,
      message: `Volume ${volume.volumeNumber} has been favorited.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.exportVolumeRange = async (req, res) => {
  try {
    const { start, end } = req.body;

    if (typeof start !== "number" || typeof end !== "number" || start > end || start < 1) {
      return res.status(400).json({ success: false, message: "Invalid volume range provided." });
    }

    const volumes = await Volume.find({
      volumeNumber: { $gte: start, $lte: end },
      status: "published",
    }).sort({ volumeNumber: 1 });

    if (volumes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published volumes found in the specified range.",
      });
    }

    // --- CORRECTED FORMATTING LOGIC ---
    let fileContent = `The Abel Experience™ CFW - Exported Volumes ${start}-${end}\n`;
    fileContent += `Generated on: ${new Date().toISOString()}\n`;
    fileContent += "========================================\n\n";

    for (const vol of volumes) {
      fileContent += `--- Volume ${vol.volumeNumber}: ${vol.title} ---\n\n`;

      // Add body lines
      vol.bodyLines.forEach((line) => {
        fileContent += line.trim() === "" ? "\n" : `> ${line}\n`;
      });

      // Add blessings section
      if (vol.blessings && vol.blessings.length > 0) {
        fileContent += `\n${vol.blessingIntro}\n`;
        vol.blessings.forEach((b) => {
          fileContent += `- ${b.item} (${b.description})\n`;
        });
      }

      // Add dream section
      if (vol.dream) {
        fileContent += `\n${vol.dream}\n`;
      }

      // Add edition section
      if (vol.edition) {
        // We add an extra newline before this for spacing
        fileContent += `\nThe Abel Experience™: ${vol.edition}\n`;
      }

      fileContent += "\n========================================\n\n";
    }

    res.status(200).json({ success: true, data: { content: fileContent } });
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ success: false, message: "Server Error during export." });
  }
};

exports.getRandomBlessing = async (req, res) => {
  try {
    const randomBlessing = await Volume.aggregate([
      { $match: { status: "published", "blessings.0": { $exists: true } } },
      { $unwind: "$blessings" },
      { $sample: { size: 1 } },
    ]);
    if (!randomBlessing || randomBlessing.length === 0)
      return res.status(404).json({ success: false, message: "No blessings found." });
    res.status(200).json({ success: true, data: randomBlessing[0].blessings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// New: Random blessing with volume metadata for UI consumption
exports.getRandomBlessingDetailed = async (req, res) => {
  try {
    const sampled = await Volume.aggregate([
      { $match: { status: "published", "blessings.0": { $exists: true } } },
      { $unwind: "$blessings" },
      { $sample: { size: 1 } },
      {
        $project: {
          volumeNumber: 1,
          title: 1,
          name: "$blessings.item",
          description: "$blessings.description",
        },
      },
    ]);
    if (!sampled || sampled.length === 0)
      return res.status(404).json({ success: false, message: "No blessings found." });

    const r = sampled[0];
    return res.status(200).json({
      success: true,
      data: {
        name: r.name,
        description: r.description || "",
        volumeNumber: r.volumeNumber,
        volumeTitle: r.title,
      },
    });
  } catch (error) {
    console.error("getRandomBlessingDetailed error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Deterministic daily blessing drawn from published volumes' blessings
// GET /api/public/daily-blessing?offset=0
exports.getDailyBlessing = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset || "0", 10) || 0;

    // Pull all blessings from published volumes in a stable order
    const volumes = await Volume.find({ status: "published", "blessings.0": { $exists: true } })
      .sort({ volumeNumber: 1 })
      .select("volumeNumber title blessings");

    const blessings = [];
    for (const v of volumes) {
      for (const b of v.blessings) {
        if (!b || !b.item) continue;
        blessings.push({
          name: b.item,
          description: b.description || "",
          volumeNumber: v.volumeNumber,
          volumeTitle: v.title,
        });
      }
    }

    if (blessings.length === 0) {
      return res.status(404).json({ success: false, message: "No blessings available from published volumes." });
    }

    const idx = mod(dayOfYear(new Date()) - offset, blessings.length);
    const selected = blessings[idx];
    return res.status(200).json({ success: true, data: selected });
  } catch (error) {
    console.error("getDailyBlessing error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.searchVolumes = async (req, res) => {
  try {
    const keyword = req.query.q;
    if (!keyword) return res.status(400).json({ success: false, message: "Please provide a search keyword." });
    const results = await Volume.find(
      { $text: { $search: keyword }, status: "published" },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .select("volumeNumber title");
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getLatestVolume = async (req, res) => {
  try {
    const latestVolume = await Volume.findOne({ status: "published" }).sort({
      createdAt: -1,
    });
    if (!latestVolume) return res.status(404).json({ success: false, message: "No published volumes found." });
    res.status(200).json({ success: true, data: latestVolume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.rateVolume = async (req, res) => {
  try {
    const { volumeNumber, rating } = req.body;
    if (!volumeNumber || !rating || rating < 1 || rating > 100)
      return res.status(400).json({
        success: false,
        message: "Invalid volume number or rating provided.",
      });
    const volume = await Volume.findOne({
      volumeNumber: volumeNumber,
      status: "published",
    });
    if (!volume) return res.status(404).json({ success: false, message: "Volume not found." });
    volume.ratings.push({ value: rating });
    volume.ratingCount = volume.ratings.length;
    const totalRating = volume.ratings.reduce((acc, curr) => acc + curr.value, 0);
    volume.averageRating = totalRating / volume.ratingCount;
    await volume.save();
    res.status(200).json({
      success: true,
      message: `Successfully rated Volume ${volumeNumber} with a ${rating}/100.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getPublishedVolumeCatalogue = async (req, res) => {
  try {
    const catalogue = await Volume.find({ status: "published" }).sort({ volumeNumber: 1 }).select("volumeNumber title");
    res.status(200).json({ success: true, data: catalogue });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getRandomPublishedVolume = async (req, res) => {
  try {
    const randomVolume = await Volume.aggregate([{ $match: { status: "published" } }, { $sample: { size: 1 } }]);
    if (!randomVolume || randomVolume.length === 0)
      return res.status(404).json({ success: false, message: "No published volumes found." });
    res.status(200).json({ success: true, data: randomVolume[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getPublishedVolumeByNumber = async (req, res) => {
  try {
    const volume = await Volume.findOne({
      volumeNumber: req.params.volumeNumber,
      status: "published",
    });
    if (!volume)
      return res.status(404).json({
        success: false,
        message: "Volume not found or is not published.",
      });
    res.status(200).json({ success: true, data: volume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
