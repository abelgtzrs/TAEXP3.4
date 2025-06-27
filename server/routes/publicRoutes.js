const express = require('express');
const router = express.Router();

const {
    getPublishedVolumeCatalogue,
    getRandomPublishedVolume,
    getPublishedVolumeByNumber,
    getRandomBlessing,
    searchVolumes,
    getLatestVolume,
    rateVolume
} = require('../controllers/publicController');

// Existing Routes
router.get('/volumes/catalogue', getPublishedVolumeCatalogue);
router.get('/volumes/random', getRandomPublishedVolume);
router.get('/volumes/id/:volumeNumber', getPublishedVolumeByNumber);

// New Routes
router.get('/motd', getRandomBlessing);
router.get('/volumes/search', searchVolumes);
router.get('/volumes/latest', getLatestVolume);
router.post('/volumes/rate', rateVolume);

module.exports = router;
