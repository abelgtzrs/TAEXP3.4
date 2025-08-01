// server/controllers/shopController.js

// Make sure all these models are imported at the top of your file
const User = require("../models/User");
const PokemonBase = require("../models/PokemonBase");
const UserPokemon = require("../models/userSpecific/userPokemon");
const SnoopyArtBase = require("../models/SnoopyArtBase");
const UserSnoopyArt = require("../models/userSpecific/userSnoopyArt");
const YugiohCardBase = require("../models/YugiohCardBase");
const UserYugiohCard = require("../models/userSpecific/userYugiohCard");
const HabboRareBase = require("../models/HabboRareBase");
const UserHabboRare = require("../models/userSpecific/userHabboRare");
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

// --- NEW HELPER FUNCTION FOR ABEL PERSONA WEIGHTED PULLS ---
const pullAbelPersona = async () => {
  const rarityRates = [
    { rarity: "common", weight: 0.45 }, // 45% chance
    { rarity: "rare", weight: 0.3 }, // 30% chance
    { rarity: "epic", weight: 0.15 }, // 15% chance
    { rarity: "mythic", weight: 0.08 }, // 8% chance
    { rarity: "transcendent", weight: 0.02 }, // 2% chance
  ];

  // Step 1: Roll for rarity
  const roll = Math.random();
  let cumulativeWeight = 0;
  let chosenRarity = "common"; // Default to common

  for (const rate of rarityRates) {
    cumulativeWeight += rate.weight;
    if (roll < cumulativeWeight) {
      chosenRarity = rate.rarity;
      break;
    }
  }

  // Step 2: Get a random persona from that rarity pool
  const pool = await AbelPersonaBase.find({ rarity: chosenRarity });
  if (pool.length > 0) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  } else {
    // Fallback: if no personas of that rarity exist, pull a common persona
    const commonPool = await AbelPersonaBase.find({ rarity: "common" });
    if (commonPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * commonPool.length);
      return commonPool[randomIndex];
    }
  }
  return null;
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

    if (category.toLowerCase() === "yugioh") {
      pulledItems = await pullYugiohPack(); // Uncommented this line
      message = `You opened a pack and found 6 cards!`;
    } else if (category.toLowerCase() === "abelpersona") {
      // Use weighted pulls for Abel Personas
      const item = await pullAbelPersona();
      if (item) {
        pulledItems.push(item);
      }
    } else {
      const count = await config.BaseModel.countDocuments();
      if (count > 0) {
        const random = Math.floor(Math.random() * count);
        const item = await config.BaseModel.findOne().skip(random);
        if (item) {
          pulledItems.push(item);
        }
      }
    }

    if (pulledItems.length === 0) {
      return res.status(500).json({ success: false, message: "Failed to pull any items. Please try again." });
    }

    // --- THIS IS THE FIX ---
    // We now handle the awarding logic based on the config.

    // Deduct currency first
    user[config.currency] -= config.cost;
    let alreadyOwned = false; // Declare at the top level

    if (category.toLowerCase() === "yugioh") {
      // Special handling for yugioh packs (multiple cards)
      let newCards = 0;
      for (const card of pulledItems) {
        const existingCard = await config.UserCollectibleModel.findOne({
          user: userId,
          [config.baseModelRefField]: card._id,
        });

        if (!existingCard) {
          const newUserCollectible = await config.UserCollectibleModel.create({
            user: userId,
            [config.baseModelRefField]: card._id,
          });
          user[config.userCollectionField].push(newUserCollectible._id);
          newCards++;
        }
      }
      message = `You opened a pack and found ${newCards} new cards out of 6!`;
    } else {
      const pulledItem = pulledItems[0]; // For single pulls

      if (config.isDirectUnlock) {
        // Logic for direct unlocks like Abel Personas
        if (user[config.userCollectionField].includes(pulledItem._id)) {
          alreadyOwned = true;
        } else {
          user[config.userCollectionField].push(pulledItem._id);
          message = `Congratulations! You unlocked Persona: ${pulledItem.name}`;
        }
      } else {
        // Logic for instanced collectibles (Pokémon, Snoopys, etc.)
        const existingItem = await config.UserCollectibleModel.findOne({
          user: userId,
          [config.baseModelRefField]: pulledItem._id,
        });

        // This logic needs refinement based on whether duplicates are allowed per category
        if (existingItem && (category === "snoopy" || category === "habbo")) {
          alreadyOwned = true;
        } else {
          const newUserCollectible = await config.UserCollectibleModel.create({
            user: userId,
            [config.baseModelRefField]: pulledItem._id,
          });
          user[config.userCollectionField].push(newUserCollectible._id);
          message = `Congratulations! You pulled: ${pulledItem.name}`;
        }
      }

      if (alreadyOwned) {
        const refund = Math.floor(config.cost / 4);
        user[config.currency] += refund; // Add the refund back
        message = `You pulled a duplicate! ${refund} ${config.currency} have been refunded.`;
      }
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: message,
      data: { items: pulledItems, isDuplicate: alreadyOwned },
    });
  } catch (error) {
    console.error("Gacha Pull Error:", error);
    res.status(500).json({ success: false, message: "Server Error during gacha pull.", error: error.message });
  }
};
