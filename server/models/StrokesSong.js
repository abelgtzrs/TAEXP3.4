const mongoose = require("mongoose");

const StrokesSongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StrokesAlbum",
    required: true,
  },
  lyrics: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("StrokesSong", StrokesSongSchema);
