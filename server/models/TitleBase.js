// server/models/TitleBase.js
const mongoose = require("mongoose");

const TitleBaseSchema = new mongoose.Schema(
  {
    titleId: {
      type: Number,
      required: [true, "Please provide a unique Title ID"],
      unique: true,
    },
    name: {
      // The actual title text that gets displayed
      type: String,
      required: [true, "Please provide the Title name/text"],
      trim: true,
    },
    description: {
      // How this title is earned or what it represents
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TitleBase", TitleBaseSchema);
