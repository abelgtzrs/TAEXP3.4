const Volume = require('../models/Volumes');

exports.getRandomBlessing = async (req, res) => {
    try {
        const randomBlessing = await Volume.aggregate([
            { $match: { status: 'published', 'blessings.0': { $exists: true } } },
            { $unwind: '$blessings' },
            { $sample: { size: 1 } }
        ]);
        if (!randomBlessing || randomBlessing.length === 0) return res.status(404).json({ success: false, message: 'No blessings found.' });
        res.status(200).json({ success: true, data: randomBlessing[0].blessings });
    } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.searchVolumes = async (req, res) => {
    try {
        const keyword = req.query.q;
        if (!keyword) return res.status(400).json({ success: false, message: 'Please provide a search keyword.' });
        const results = await Volume.find({ $text: { $search: keyword }, status: 'published' },{ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).select('volumeNumber title');
        res.status(200).json({ success: true, data: results });
    } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.getLatestVolume = async (req, res) => {
    try {
        const latestVolume = await Volume.findOne({ status: 'published' }).sort({ createdAt: -1 });
        if (!latestVolume) return res.status(404).json({ success: false, message: 'No published volumes found.' });
        res.status(200).json({ success: true, data: latestVolume });
    } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.rateVolume = async (req, res) => {
    try {
        const { volumeNumber, rating } = req.body;
        if (!volumeNumber || !rating || rating < 1 || rating > 100) return res.status(400).json({ success: false, message: 'Invalid volume number or rating provided.' });
        const volume = await Volume.findOne({ volumeNumber: volumeNumber, status: 'published' });
        if (!volume) return res.status(404).json({ success: false, message: 'Volume not found.' });
        volume.ratings.push({ value: rating });
        volume.ratingCount = volume.ratings.length;
        const totalRating = volume.ratings.reduce((acc, curr) => acc + curr.value, 0);
        volume.averageRating = totalRating / volume.ratingCount;
        await volume.save();
        res.status(200).json({ success: true, message: `Successfully rated Volume ${volumeNumber} with a ${rating}/100.` });
    } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.getPublishedVolumeCatalogue = async (req, res) => {
    try {
        const catalogue = await Volume.find({ status: 'published' }).sort({ volumeNumber: 1 }).select('volumeNumber title');
        res.status(200).json({ success: true, data: catalogue });
    } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.getRandomPublishedVolume = async (req, res) => {
    try {
        const randomVolume = await Volume.aggregate([{ $match: { status: 'published' } }, { $sample: { size: 1 } }]);
        if (!randomVolume || randomVolume.length === 0) return res.status(404).json({ success: false, message: 'No published volumes found.' });
        res.status(200).json({ success: true, data: randomVolume[0] });
    } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.getPublishedVolumeByNumber = async (req, res) => {
    try {
        const volume = await Volume.findOne({ volumeNumber: req.params.volumeNumber, status: 'published' });
        if (!volume) return res.status(404).json({ success: false, message: 'Volume not found or is not published.' });
        res.status(200).json({ success: true, data: volume });
    } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};
