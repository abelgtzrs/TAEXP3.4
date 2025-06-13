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

// --- GACHA CONFIGURATION ---
// This configuration object makes our controller clean and easy to modify.
// It defines the rules for each gacha category.
const GACHA_CONFIG = {
  pokemon: {
    cost: 5,
    currency: "temuTokens",
    BaseModel: PokemonBase,
    UserCollectibleModel: UserPokemon,
    userCollectionField: "pokemonCollection", // Field on User schema
    baseModelRefField: "basePokemon", // Field on UserPokemon schema
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
    // Abel Personas are unlocked directly on the User model, not in a separate instance collection.
    isDirectUnlock: true,
    userCollectionField: "unlockedAbelPersonas",
  },
};

// @desc    Perform a gacha pull for a specific category
// @route   POST /api/shop/pull/:category
exports.pullFromGacha = async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user.id;

    const config = GACHA_CONFIG[category.toLowerCase()];
    if (!config) {
      return res
        .status(404)
        .json({ success: false, message: "Gacha category not found." });
    }

    const user = await User.findById(userId);

    if (user[config.currency] < config.cost) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Insufficient funds. Requires ${config.cost} ${config.currency}.`,
        });
    }

    let pulledItem; // We will define this based on the category

    // --- NEW LOGIC FOR POKEMON PULLS ---
    if (category.toLowerCase() === "pokemon") {
      // --- Step 2.1: Define Pull Rates ---
      // These probabilities determine WHICH STAGE of Pokémon to pull from.
      const POKEMON_PULL_RATES = {
        stage1: 0.85, // 85% chance to get a Stage 1 Pokémon
        stage2: 0.149, // 14.9% chance to get a Stage 2 Pokémon
        stage3: 0.001, // 0.1% chance for a very rare Stage 3 pull
      };

      // --- Step 2.2: Fetch and Categorize Available Pokémon ---
      const allPokemon = await PokemonBase.find({});
      const stage1Pool = allPokemon.filter((p) => p.evolutionStage === 1);
      const stage2Pool = allPokemon.filter((p) => p.evolutionStage === 2);
      const stage3Pool = allPokemon.filter((p) => p.evolutionStage === 3);

      // --- Step 2.3: First Roll - Determine the Rarity/Stage ---
      const roll = Math.random();
      let selectedPool;

      if (roll < POKEMON_PULL_RATES.stage1) {
        selectedPool = stage1Pool;
      } else if (roll < POKEMON_PULL_RATES.stage1 + POKEMON_PULL_RATES.stage2) {
        selectedPool = stage2Pool;
      } else {
        selectedPool = stage3Pool;
      }

      // Fallback to Stage 1 if a selected pool is empty for some reason
      if (!selectedPool || selectedPool.length === 0) {
        selectedPool = stage1Pool;
      }
      if (selectedPool.length === 0) {
        return res
          .status(500)
          .json({
            success: false,
            message: "No Pokémon available in the pull pool.",
          });
      }

      // --- Step 2.4: Second Roll - Pick a Random Pokémon from the Chosen Pool ---
      const randomIndex = Math.floor(Math.random() * selectedPool.length);
      pulledItem = selectedPool[randomIndex];
    } else {
      // --- Original Logic for all other categories ---
      const count = await config.BaseModel.countDocuments();
      if (count === 0) {
        return res
          .status(500)
          .json({
            success: false,
            message: `No items available in the ${category} pool.`,
          });
      }
      const random = Math.floor(Math.random() * count);
      pulledItem = await config.BaseModel.findOne().skip(random);
    }

    if (!pulledItem) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to pull an item. Please try again.",
        });
    }

    // --- The rest of the logic for awarding, handling duplicates, and saving remains the same ---

    // --- 4. Handle Awarding the Item ---
    let alreadyOwned = false;

    if (config.isDirectUnlock) {
      // For direct unlocks like Abel Personas
      if (user[config.userCollectionField].includes(pulledItem._id)) {
        alreadyOwned = true;
      } else {
        user[config.userCollectionField].push(pulledItem._id);
      }
    } else {
      // For instanced collectibles
      // Let's assume for now duplicates are only disallowed for snoopys and habbos
      if (category === "snoopy" || category === "habbo") {
        const existingItem = await config.UserCollectibleModel.findOne({
          user: userId,
          [config.baseModelRefField]: pulledItem._id,
        });
        if (existingItem) {
          alreadyOwned = true;
        }
      }

      if (!alreadyOwned) {
        const newUserCollectible = await config.UserCollectibleModel.create({
          user: userId,
          [config.baseModelRefField]: pulledItem._id,
          // If it's a pokemon, start it at level 1
          level: category === "pokemon" ? 1 : undefined,
        });
        user[config.userCollectionField].push(newUserCollectible._id);
      }
    }

    // --- 5. Handle Duplicates ---
    if (alreadyOwned) {
      const refund = Math.floor(config.cost / 4);
      user[config.currency] += refund;
      await user.save();
      return res.status(200).json({
        success: true,
        message: `You pulled a duplicate! ${refund} ${config.currency} have been refunded.`,
        data: { item: pulledItem, isDuplicate: true },
      });
    }

    // --- 6. Deduct Currency & Save ---
    user[config.currency] -= config.cost;
    await user.save();

    // --- 7. Send Success Response ---
    res.status(201).json({
      success: true,
      message: `Congratulations! You pulled: ${pulledItem.name}`,
      data: { item: pulledItem, isDuplicate: false },
    });
  } catch (error) {
    console.error("Gacha Pull Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error during gacha pull.",
        error: error.message,
      });
  }
};
