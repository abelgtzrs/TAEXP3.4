// server/controllers/userController.js
const User = require("../models/User");

// @desc    Get a user's full collection for a specific type
// @route   GET /api/users/me/collection/:type
exports.getUserCollection = async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.user.id;

    // Configuration map to know which fields to populate
    const collectionConfig = {
      pokemon: { path: "pokemonCollection", populate: { path: "basePokemon" } },
      snoopy: {
        path: "snoopyArtCollection",
        populate: { path: "snoopyArtBase" },
      },
      habbo: { path: "habboRares", populate: { path: "habboRareBase" } },
      yugioh: { path: "yugiohCards", populate: { path: "yugiohCardBase" } },
      // Add other collection types here later
    };

    const config = collectionConfig[type.toLowerCase()];
    if (!config) {
      return res.status(400).json({ success: false, message: "Invalid collection type" });
    }

    const user = await User.findById(userId).populate(config);

    res.status(200).json({ success: true, data: user[config.path] });
  } catch (error) {
    console.error("Get Collection Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update the displayed items for a user's profile
// @route   PUT /api/users/me/profile/display
exports.updateDisplayedItems = async (req, res) => {
  try {
    const { collectionType, items } = req.body; // e.g., collectionType: 'pokemon', items: ['id1', 'id2']
    const userId = req.user.id;

    // Configuration map for validation and updating
    const displayConfig = {
      pokemon: {
        field: "displayedPokemon",
        limit: 6,
        collectionField: "pokemonCollection",
      },
      snoopy: {
        field: "displayedSnoopyArt",
        limit: 6,
        collectionField: "snoopyArtCollection",
      },
      habbo: {
        field: "displayedHabboRares",
        limit: 6,
        collectionField: "habboRares",
      },
      yugioh: {
        field: "displayedYugiohCards",
        limit: 6,
        collectionField: "yugiohCards",
      },
    };

    const config = displayConfig[collectionType.toLowerCase()];
    if (!config) {
      return res.status(400).json({ success: false, message: "Invalid collection type" });
    }

    if (!Array.isArray(items) || items.length > config.limit) {
      return res.status(400).json({
        success: false,
        message: `Invalid items array. Maximum of ${config.limit} items allowed.`,
      });
    }

    const user = await User.findById(userId);

    // Security Check: Verify that every item ID submitted actually belongs to the user.
    const userCollectionIds = user[config.collectionField].map((id) => id.toString());
    const allItemsOwnedByUser = items.every((itemId) => userCollectionIds.includes(itemId));

    if (!allItemsOwnedByUser) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You can only display items you own.",
      });
    }

    // Update the user document and save
    user[config.field] = items;
    await user.save({ validateBeforeSave: false }); // Skip full validation to just save the array

    res.status(200).json({
      success: true,
      message: "Display updated successfully.",
      data: user[config.field],
    });
  } catch (error) {
    console.error("Update Display Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
