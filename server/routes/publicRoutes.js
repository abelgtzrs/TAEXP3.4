const express = require("express");
const router = express.Router();

const {
  getPublishedVolumeCatalogue,
  getRandomPublishedVolume,
  getPublishedVolumeByNumber,
  getRandomBlessing,
  searchVolumes,
  getLatestVolume,
  rateVolume,
  exportVolumeRange,
  favoriteVolume,
} = require("../controllers/publicController");

// Existing Routes
router.get("/volumes/catalogue", getPublishedVolumeCatalogue);
router.get("/volumes/random", getRandomPublishedVolume);
router.get("/volumes/latest", getLatestVolume);
router.get("/volumes/search", searchVolumes);
router.get("/volumes/id/:volumeNumber", getPublishedVolumeByNumber);

// New Routes
router.post("/volumes/rate", rateVolume);
router.post("/volumes/:volumeNumber/favorite", favoriteVolume);
router.post("/volumes/export", exportVolumeRange);
router.get("/motd", getRandomBlessing);

module.exports = router;
