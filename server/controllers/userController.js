const User = require("../models/User");
const Habit = require("../models/userSpecific/Habit");
const Book = require("../models/userSpecific/Book");
const WorkoutLog = require("../models/userSpecific/WorkoutLog");
const Volume = require("../models/Volume");

// --- Daily Login Streak Utilities ---
const isSameDay = (a, b) => a && b && new Date(a).toDateString() === new Date(b).toDateString();

// Return whether today has been counted and current streaks
const getStreakStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("lastLoginDate currentLoginStreak longestLoginStreak");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const today = new Date();
    const countedToday = isSameDay(user.lastLoginDate, today);
    return res.status(200).json({
      success: true,
      data: {
        countedToday,
        currentLoginStreak: user.currentLoginStreak || 0,
        longestLoginStreak: user.longestLoginStreak || 0,
        lastLoginDate: user.lastLoginDate || null,
      },
    });
  } catch (error) {
    console.error("Get Streak Status Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Increment today's streak if not already counted; mirrors login logic safely
const tickLoginStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "+password lastLoginDate currentLoginStreak longestLoginStreak email"
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const today = new Date();
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;

    // If already counted today, no-op
    if (isSameDay(lastLogin, today)) {
      return res.status(200).json({
        success: true,
        data: {
          changed: false,
          countedToday: true,
          currentLoginStreak: user.currentLoginStreak || 0,
          longestLoginStreak: user.longestLoginStreak || 0,
          lastLoginDate: user.lastLoginDate || null,
        },
      });
    }

    // Determine if yesterday to continue streak
    let wasYesterday = false;
    if (lastLogin) {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      wasYesterday = lastLogin.toDateString() === yesterday.toDateString();
    }

    if (wasYesterday) {
      user.currentLoginStreak = (user.currentLoginStreak || 0) + 1;
    } else {
      user.currentLoginStreak = 1;
    }

    if ((user.currentLoginStreak || 0) > (user.longestLoginStreak || 0)) {
      user.longestLoginStreak = user.currentLoginStreak;
    }

    // Optional: badge awarding hook every 3 days
    if (user.currentLoginStreak > 0 && user.currentLoginStreak % 3 === 0) {
      console.log(
        `User ${user.email} reached a ${user.currentLoginStreak}-day streak via tick! Consider awarding a badge.`
      );
    }

    user.lastLoginDate = today;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      data: {
        changed: true,
        countedToday: true,
        currentLoginStreak: user.currentLoginStreak || 0,
        longestLoginStreak: user.longestLoginStreak || 0,
        lastLoginDate: user.lastLoginDate || null,
      },
    });
  } catch (error) {
    console.error("Tick Login Streak Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- ADD THIS NEW FUNCTION ---
const updateProfilePicture = async (req, res) => {
  try {
    console.log("updateProfilePicture called");
    console.log("req.file:", req.file);

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // The path should be the URL path, not the file system path
    const profilePictureUrl = `/uploads/avatars/${req.file.filename}`;
    console.log("Generated profile picture URL:", profilePictureUrl);

    // Find user and update their profile picture URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: profilePictureUrl },
      { new: true, runValidators: true } // Return the updated document
    )
      .select("-password")
      .populate({
        path: "activeAbelPersona",
        model: "AbelPersonaBase",
      })
      .populate({
        path: "unlockedAbelPersonas",
        model: "AbelPersonaBase",
      })
      .populate({
        path: "displayedPokemon",
        populate: { path: "basePokemon", model: "PokemonBase" },
      })
      .populate({
        path: "displayedSnoopyArt",
        populate: { path: "snoopyArtBase", model: "SnoopyArtBase" },
      })
      .populate({
        path: "displayedHabboRares",
        populate: { path: "habboRareBase", model: "HabboRareBase" },
      })
      .populate({
        path: "displayedYugiohCards",
        populate: { path: "yugiohCardBase", model: "YugiohCardBase" },
      })
      .populate({
        path: "badges",
        populate: { path: "badgeBase", model: "BadgeBase" },
      })
      .populate({
        path: "equippedTitle",
        populate: { path: "titleBase", model: "TitleBase" },
      });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ success: false, message: "User not found." });
    }

    console.log("User updated successfully. New profilePicture:", user.profilePicture);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Update Profile Picture Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Define all functions as constants before exporting ---

const setActivePersona = async (req, res) => {
  try {
    const { personaId } = req.body;
    const user = await User.findById(req.user.id);

    // Security check: ensure the user has unlocked this persona before activating.
    // We also allow `null` to be passed to deactivate a persona.
    if (personaId && !user.unlockedAbelPersonas.includes(personaId)) {
      return res.status(403).json({ success: false, message: "Persona not unlocked." });
    }

    // Set the active persona field to the new ID or null.
    user.activeAbelPersona = personaId || null;
    await user.save({ validateBeforeSave: false });

    // --- CRUCIAL FIX ---
    // After saving, we re-fetch the user and explicitly populate the 'activeAbelPersona' field.
    // This ensures the full theme data is sent back to the frontend.
    const updatedUser = await User.findById(req.user.id)
      .select("-password")
      .populate({
        path: "activeAbelPersona",
        model: "AbelPersonaBase",
      })
      .populate({
        path: "unlockedAbelPersonas", // Also populate the list of unlocked personas
        model: "AbelPersonaBase",
      })
      .populate({
        path: "displayedPokemon",
        populate: { path: "basePokemon", model: "PokemonBase" },
      })
      .populate({
        path: "displayedSnoopyArt",
        populate: { path: "snoopyArtBase", model: "SnoopyArtBase" },
      })
      .populate({
        path: "displayedHabboRares",
        populate: { path: "habboRareBase", model: "HabboRareBase" },
      })
      .populate({
        path: "displayedYugiohCards",
        populate: { path: "yugiohCardBase", model: "YugiohCardBase" },
      })
      .populate({
        path: "badges",
        populate: { path: "badgeBase", model: "BadgeBase" },
      })
      .populate({
        path: "equippedTitle",
        populate: { path: "titleBase", model: "TitleBase" },
      });

    // We also need to repopulate other fields for consistency if the user object is used elsewhere.
    // For now, focusing on the persona.

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Set Active Persona Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getUserCollection = async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.user.id;

    const collectionConfig = {
      pokemon: { path: "pokemonCollection", populate: { path: "basePokemon" } },
      snoopy: { path: "snoopyArtCollection", populate: { path: "snoopyArtBase" } },
      habbo: { path: "habboRares", populate: { path: "habboRareBase" } },
      yugioh: { path: "yugiohCards", populate: { path: "yugiohCardBase" } },
    };

    const config = collectionConfig[type.toLowerCase()];
    if (!config) {
      return res.status(400).json({ success: false, message: "Invalid collection type" });
    }

    const user = await User.findById(userId).populate(config);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user[config.path] });
  } catch (error) {
    console.error("Get Collection Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateDisplayedItems = async (req, res) => {
  try {
    const { collectionType, items } = req.body;
    const userId = req.user.id;

    const displayConfig = {
      pokemon: { field: "displayedPokemon", limit: 6, collectionField: "pokemonCollection" },
      snoopy: { field: "displayedSnoopyArt", limit: 6, collectionField: "snoopyArtCollection" },
      habbo: { field: "displayedHabboRares", limit: 6, collectionField: "habboRares" },
      yugioh: { field: "displayedYugiohCards", limit: 6, collectionField: "yugiohCards" },
    };

    const config = displayConfig[collectionType.toLowerCase()];
    if (!config) {
      return res.status(400).json({ success: false, message: "Invalid collection type" });
    }

    if (!Array.isArray(items) || items.length > config.limit) {
      return res
        .status(400)
        .json({ success: false, message: `Invalid items array. Maximum of ${config.limit} items allowed.` });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const userCollectionIds = user[config.collectionField].map((id) => id.toString());
    const allItemsOwnedByUser = items.every((itemId) => userCollectionIds.includes(itemId));

    if (!allItemsOwnedByUser) {
      return res.status(403).json({ success: false, message: "Forbidden. You can only display items you own." });
    }

    user[config.field] = items;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: "Display updated successfully.", data: user[config.field] });
  } catch (error) {
    console.error("Update Display Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- UPDATED AND EXPANDED FUNCTION ---
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // --- Basic Stats ---
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [habitsCompletedToday, booksFinished, totalWorkouts, user] = await Promise.all([
      Habit.countDocuments({ user: userId, lastCompletedDate: { $gte: startOfToday } }),
      Book.countDocuments({ user: userId, isFinished: true }),
      WorkoutLog.countDocuments({ user: userId }),
      User.findById(userId)
        .select("currentLoginStreak longestLoginStreak pokemonCollection snoopyArtCollection habboRares yugiohCards")
        .populate({
          path: "pokemonCollection",
          options: { sort: { createdAt: -1 }, limit: 5 },
          populate: { path: "basePokemon" },
        })
        .populate({
          path: "snoopyArtCollection",
          options: { sort: { createdAt: -1 }, limit: 5 },
          populate: { path: "snoopyArtBase" },
        })
        .populate({
          path: "habboRares",
          options: { sort: { createdAt: -1 }, limit: 5 },
          populate: { path: "habboRareBase" },
        })
        .populate({
          path: "yugiohCards",
          options: { sort: { createdAt: -1 }, limit: 5 },
          populate: { path: "yugiohCardBase" },
        }),
    ]);

    // --- Recent Acquisitions Logic ---
    const allCollections = [
      ...user.pokemonCollection.map((p) => ({ ...p.toObject(), type: "Pokémon" })),
      ...user.snoopyArtCollection.map((s) => ({ ...s.toObject(), type: "Snoopy" })),
      ...user.habboRares.map((h) => ({ ...h.toObject(), type: "Habbo Rare" })),
      ...user.yugiohCards.map((y) => ({ ...y.toObject(), type: "Yu-Gi-Oh! Card" })),
    ];

    // Sort all collected items by date and get the 5 most recent
    const recentAcquisitions = allCollections
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((item) => {
        const base = item.basePokemon || item.snoopyArtBase || item.habboRareBase || item.yugiohCardBase;
        return {
          name: base.name,
          rarity: base.rarity || base.systemRarity || "common",
          type: item.type,
        };
      });

    // --- Admin-specific Stats ---
    let volumesPublished = 0;
    if (userRole === "admin") {
      volumesPublished = await Volume.countDocuments({ createdBy: userId, status: "published" });
    }

    const totalCollectibles =
      user.pokemonCollection.length +
      user.snoopyArtCollection.length +
      user.habboRares.length +
      user.yugiohCards.length;

    const stats = {
      // For StatBoxRow
      habitsCompleted: habitsCompletedToday,
      booksFinished: booksFinished,
      gachaPulls: totalCollectibles,
      activeStreaks: user.currentLoginStreak || 0,
      totalWorkouts: totalWorkouts,
      volumesPublished: volumesPublished,

      // For Widgets
      recentAcquisitions: recentAcquisitions,

      // Mock data for now, to be replaced later
      topProducts: [
        { name: "Abel Persona: Stoic", units: 210 },
        { name: "Snoopy: Joe Cool", units: 198 },
        { name: "Pokémon: Eevee", units: 188 },
        { name: "Habbo Rare: Throne", units: 130 },
      ],
      goals: {
        reading: 65,
        workouts: 80,
      },
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Update profile fields (bio, location, website, pronouns) ---
const updateProfileBio = async (req, res) => {
  try {
    const allowed = ["bio", "location", "website", "motto"];
    const updates = {};
    for (const k of allowed) {
      if (k in req.body) updates[k] = req.body[k];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields supplied" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate({ path: "activeAbelPersona", model: "AbelPersonaBase" })
      .populate({ path: "unlockedAbelPersonas", model: "AbelPersonaBase" })
      .populate({ path: "displayedPokemon", populate: { path: "basePokemon", model: "PokemonBase" } })
      .populate({ path: "displayedSnoopyArt", populate: { path: "snoopyArtBase", model: "SnoopyArtBase" } })
      .populate({ path: "displayedHabboRares", populate: { path: "habboRareBase", model: "HabboRareBase" } })
      .populate({ path: "displayedYugiohCards", populate: { path: "yugiohCardBase", model: "YugiohCardBase" } })
      .populate({ path: "badges", populate: { path: "badgeBase", model: "BadgeBase" } })
      .populate({ path: "equippedTitle", populate: { path: "titleBase", model: "TitleBase" } });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Update Profile Bio Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Admin: Get all users (lean list) ---
const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({})
      .select(
        "email username role level experience temuTokens gatillaGold wendyHearts currentLoginStreak longestLoginStreak createdAt profilePicture"
      )
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Admin getAllUsers Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Admin: Update user fields (role, username, level, XP, and currency balances) ---
const updateUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ["username", "role", "level", "experience", "temuTokens", "gatillaGold", "wendyHearts"]; // safe updatable fields
    const updates = {};

    for (const k of allowed) {
      if (k in req.body) {
        // Coerce numeric fields and validate non-negativity where applicable
        if (["level", "experience", "temuTokens", "gatillaGold", "wendyHearts"].includes(k)) {
          const num = Number(req.body[k]);
          if (!Number.isFinite(num)) {
            return res.status(400).json({ success: false, message: `${k} must be a number` });
          }
          if (["experience", "temuTokens", "gatillaGold", "wendyHearts"].includes(k) && num < 0) {
            return res.status(400).json({ success: false, message: `${k} cannot be negative` });
          }
          updates[k] = num;
        } else {
          updates[k] = req.body[k];
        }
      }
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields supplied" });
    }
    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select(
      "email username role level experience temuTokens gatillaGold wendyHearts currentLoginStreak longestLoginStreak createdAt profilePicture"
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Admin updateUser Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Admin: Reset user password ---
const resetUserPasswordAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 chars" });
    }
    const user = await User.findById(id).select("password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.password = newPassword; // will hash via pre-save hook
    await user.save();
    res.status(200).json({ success: true, message: "Password reset" });
  } catch (error) {
    console.error("Admin resetUserPassword Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Export all functions together in one object ---
module.exports = {
  getUserCollection,
  updateDisplayedItems,
  getDashboardStats,
  setActivePersona,
  updateProfilePicture, // <-- EXPORT NEW FUNCTION
  getAllUsersAdmin,
  updateUserAdmin,
  resetUserPasswordAdmin,
  // Streak endpoints
  getStreakStatus,
  tickLoginStreak,
  updateProfileBio,
};
