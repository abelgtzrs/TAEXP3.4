// server/routes/publicRoutes.js
const express = require('express');
const router = express.Router();

const {
    getPublishedVolumeCatalogue,
    getRandomPublishedVolume,
    getPublishedVolumeByNumber
} = require('../controllers/publicController');

// Define the public routes. No 'protect' middleware is needed here.
router.get('/volumes/catalogue', getPublishedVolumeCatalogue);
router.get('/volumes/random', getRandomPublishedVolume);
router.get('/volumes/id/:volumeNumber', getPublishedVolumeByNumber);

module.exports = router;