// server/models/YugiohCardBase.js
const mongoose = require("mongoose");

const YugiohCardBaseSchema = new mongoose.Schema(
  {
    cardDatabaseId: {
      // ID from a public database like YGOPRODeck if you're importing
      type: Number,
      unique: true,
      sparse: true, // Allows nulls to be unique, useful if not all cards have this ID
    },
    name: {
      type: String,
      required: [true, "Please provide the card name"],
      trim: true,
      index: true,
    },
    type: {
      // e.g., "Effect Monster", "Spell Card", "Trap Card", "Synchro Monster", "XYZ Monster", "Link Monster"
      type: String,
      required: true,
    },
    frameType: {
      // e.g., "effect", "spell", "trap", "normal_monster"
      type: String,
    },
    description: {
      // Card effect text or flavor text
      type: String,
      required: true,
    },
    atk: {
      type: Number,
      // For non-monsters or monsters with '?', this might be null or a special value.
    },
    def: {
      type: Number,
    },
    level: {
      // Level for main deck monsters, Rank for XYZ, Link Rating for Link
      type: Number,
    },
    race: {
      // Monster type/race, e.g., "Warrior", "Spellcaster", "Dragon"
      type: String,
    },
    attribute: {
      // e.g., "DARK", "LIGHT", "EARTH", "WATER", "FIRE", "WIND", "DIVINE"
      type: String,
    },
    archetype: {
      type: String,
    },
    imageUrl: {
      // URL to the card image
      type: String,
      required: true,
    },
    imageUrlSmall: {
      type: String,
    },
    // Rarity in your system, not necessarily TCG rarity
    systemRarity: {
      type: String,
      enum: [
        "common_card",
        "uncommon_card",
        "rare_card",
        "super_card",
        "ultra_card",
      ],
      default: "common_card",
    },
    // Add other fields as needed based on Yu-Gi-Oh card specifics:
  },
  { timestamps: true }
);

module.exports = mongoose.model("YugiohCardBase", YugiohCardBaseSchema);
