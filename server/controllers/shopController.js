// server/controllers/shopController.js

// Make sure all these models are imported at the top of your file
const User = require("../models/User");
const PokemonBase = require("../models/PokemonBase");
const UserPokemon = require("../models/userSpecific/UserPokemon");
const SnoopyArtBase = require("../models/SnoopyArtBase");
const UserSnoopyArt = require("../models/userSpecific/UserSnoopyArt");
const YugiohCardBase = require("../models/YugiohCardBase");
const UserYugiohCard = require("../models/userSpecific/UserYugiohCard");
const HabboRareBase = require("../models/HabboRareBase");
const UserHabboRare = require("../models/userSpecific/UserHabboRare");
const AbelPersonaBase = require("../models/AbelPersonaBase");

const GACHA_CONFIG = {
  pokemon: {
    cost: 5,
    currency: "temuTokens",
    BaseModel: PokemonBase,
    UserCollectibleModel: UserPokemon,
    userCollectionField: "pokemonCollection",
    baseModelRefField: "basePokemon",
  },
  yugioh: {
    cost: 5,
    currency: "temuTokens",
    BaseModel: YugiohCardBase,
    UserCollectibleModel: UserYugiohCard,
    userCollectionField: "yugiohCards",
    baseModelRefField: "yugiohCardBase",
  },
  snoopy: {
    cost: 20,
    currency: "gatillaGold",
    BaseModel: SnoopyArtBase,
    UserCollectibleModel: UserSnoopyArt,
    userCollectionField: "snoopyArtCollection",
    baseModelRefField: "snoopyArtBase",
  },
  habbo: {
    cost: 20,
    currency: "gatillaGold",
    BaseModel: HabboRareBase,
    UserCollectibleModel: UserHabboRare,
    userCollectionField: "habboRares",
    baseModelRefField: "habboRareBase",
  },
  abelpersona: {
    cost: 10,
    currency: "wendyHearts",
    BaseModel: AbelPersonaBase,
    isDirectUnlock: true,
    userCollectionField: "unlockedAbelPersonas",
  },
};

// --- NEW HELPER FUNCTION FOR YU-GI-OH! PULLS ---
const pullYugiohPack = async () => {
  const rarityRates = [
    { rarity: "Common", weight: 0.5 },
    { rarity: "Rare", weight: 0.3 },
    { rarity: "Super Rare", weight: 0.1 },
    { rarity: "Ultra Rare", weight: 0.05 },
    { rarity: "Secret Rare", weight: 0.03 },
    { rarity: "Ultimate Rare", weight: 0.02 },
  ];

  const pulledCards = [];
  for (let i = 0; i < 6; i++) {
    // Step 1: Roll for rarity
    const roll = Math.random();
    let cumulativeWeight = 0;
    let chosenRarity = "Common"; // Default to common

    for (const rate of rarityRates) {
      cumulativeWeight += rate.weight;
      if (roll < cumulativeWeight) {
        chosenRarity = rate.rarity;
        break;
      }
    }

    // Step 2: Get a random card from that rarity pool
    const pool = await YugiohCardBase.find({ systemRarity: chosenRarity });
    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      pulledCards.push(pool[randomIndex]);
    } else {
      // Fallback: if no cards of that rarity exist, pull a common card
      const commonPool = await YugiohCardBase.find({ systemRarity: "Common" });
      if (commonPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * commonPool.length);
        pulledCards.push(commonPool[randomIndex]);
      }
    }
  }
  return pulledCards;
};

exports.pullFromGacha = async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user.id;

    const config = GACHA_CONFIG[category.toLowerCase()];
    if (!config) {
      return res.status(404).json({ success: false, message: "Gacha category not found." });
    }

    const user = await User.findById(userId);

    if (user[config.currency] < config.cost) {
      return res
        .status(400)
        .json({ success: false, message: `Insufficient funds. Requires ${config.cost} ${config.currency}.` });
    }

    let pulledItems = [];
    let message = "";

    // --- UPDATED LOGIC ---
    if (category.toLowerCase() === "yugioh") {
      pulledItems = await pullYugiohPack();
      message = `You opened a pack and found 6 cards!`;
    } else {
      // Original logic for single pulls (Pokémon, Snoopys, etc.)
      const count = await config.BaseModel.countDocuments();
      if (count > 0) {
        const random = Math.floor(Math.random() * count);
        const item = await config.BaseModel.findOne().skip(random);
        if (item) {
          pulledItems.push(item);
          message = `Congratulations! You pulled: ${item.name}`;
        }
      }
    }

    if (pulledItems.length === 0) {
      return res.status(500).json({ success: false, message: "Failed to pull any items. Please try again." });
    }

    // --- Awarding Logic ---
    // Deduct currency once
    user[config.currency] -= config.cost;

    // Create new user collectible documents for each pulled item
    const newUserCollectibles = [];
    for (const item of pulledItems) {
      // For now, we assume duplicates are okay for cards
      const newCollectible = await config.UserCollectibleModel.create({
        user: userId,
        [config.baseModelRefField]: item._id,
      });
      newUserCollectibles.push(newCollectible._id);
    }

    // Add all new collectible IDs to the user's collection array
    user[config.userCollectionField].push(...newUserCollectibles);

    await user.save();

    res.status(201).json({
      success: true,
      message: message,
      data: { items: pulledItems }, // Send back an array of items
    });
  } catch (error) {
    console.error("Gacha Pull Error:", error);
    res.status(500).json({ success: false, message: "Server Error during gacha pull.", error: error.message });
  }
};
