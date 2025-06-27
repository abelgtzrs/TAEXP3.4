// server/controllers/publicController.js

const Volume = require('../models/Volumes');

// @desc    Get a list of all published volumes (titles and numbers only)
// @route   GET /api/public/volumes/catalogue
exports.getPublishedVolumeCatalogue = async (req, res) => {
    try {
        const catalogue = await Volume.find({ status: 'published' })
            .sort({ volumeNumber: 1 })
            .select('volumeNumber title'); // Only select the fields we need

        res.status(200).json({ success: true, data: catalogue });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get a single random published volume
// @route   GET /api/public/volumes/random
exports.getRandomPublishedVolume = async (req, res) => {
    try {
        // Use MongoDB's aggregation pipeline to efficiently get 1 random document.
        const randomVolume = await Volume.aggregate([
            { $match: { status: 'published' } }, // Only from published volumes
            { $sample: { size: 1 } }             // Get 1 random document
        ]);

        if (!randomVolume || randomVolume.length === 0) {
            return res.status(404).json({ success: false, message: 'No published volumes found.' });
        }
        
        res.status(200).json({ success: true, data: randomVolume[0] }); // $sample returns an array
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get a specific published volume by its number
// @route   GET /api/public/volumes/id/:volumeNumber
exports.getPublishedVolumeByNumber = async (req, res) => {
    try {
        const volume = await Volume.findOne({
            volumeNumber: req.params.volumeNumber,
            status: 'published'
        });

        if (!volume) {
            return res.status(404).json({ success: false, message: 'Volume not found or is not published.' });
        }

        res.status(200).json({ success: true, data: volume });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};