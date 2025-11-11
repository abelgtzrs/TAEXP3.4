// server/controllers/badgeCollectionController.js
const BadgeCollection = require("../models/BadgeCollection");
const BadgeBase = require("../models/BadgeBase");

exports.listCollections = async (req, res) => {
  try {
    const collections = await BadgeCollection.find({}).sort({ order: 1, key: 1 });
    res.json({ success: true, data: collections });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getCollection = async (req, res) => {
  try {
    const col = await BadgeCollection.findOne({ key: req.params.key });
    if (!col) return res.status(404).json({ success: false, message: "Collection not found" });
    res.json({ success: true, data: col });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createCollection = async (req, res) => {
  try {
    const col = await BadgeCollection.create(req.body);
    res.status(201).json({ success: true, data: col });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const col = await BadgeCollection.findOne({ key: req.params.key });
    if (!col) return res.status(404).json({ success: false, message: "Collection not found" });
    Object.assign(col, req.body);
    const saved = await col.save();
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const col = await BadgeCollection.findOne({ key: req.params.key });
    if (!col) return res.status(404).json({ success: false, message: "Collection not found" });
    // Optional: ensure no badges remain in this collection
    const badgeCount = await BadgeBase.countDocuments({ collectionKey: col.key });
    if (badgeCount > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete: badges exist in this collection" });
    }
    await col.deleteOne();
    res.json({ success: true, data: {} });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
