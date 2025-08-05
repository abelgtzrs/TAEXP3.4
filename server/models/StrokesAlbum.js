const mongoose = require("mongoose");

const StrokesAlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  year: {
    type: Number,
    required: true,
  },
  coverImageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("StrokesAlbum", StrokesAlbumSchema);
