const mongoose = require("mongoose");

const YugiohCardBaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    atk: { type: Number },
    def: { type: Number },
    level: { type: Number },
    type: { type: String, required: true }, // e.g., "Effect Monster", "Spell Card"
    attribute: { type: String }, // e.g., "DARK", "LIGHT"
    race: { type: String }, // e.g., "Rock", "Spellcaster"
    systemRarity: { type: String }, // e.g., "Super Rare"
  },
  { timestamps: true }
);

module.exports = mongoose.models.YugiohCardBase || mongoose.model("YugiohCardBase", YugiohCardBaseSchema);
