const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User } = require("lucide-react");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    uniqe: true,
    match: [/^\S+@\S+\.\S+/, "Please enter a valid email address"],
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [20, "Username cannot exceed 20 characters"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false, // Exclude password from queries by default
  },
  role: {
    type: String,
    enum: ["admin", "wife_of_the_year", "user"],
    default: "user",
  },
  level: {
    type: Number,
    default: 1,
    min: [1, "Level must be at least 1"],
    max: [100, "Level cannot exceed 100"],
  },
  experience: {
    type: Number,
    default: 0,
    min: [0, "Experience cannot be negative"],
  },
  xpToNextLevel: {
    type: Number,
    default: 100,
    min: [1, "xpToNextLevel must be at least 1"],
  },
  temuTokens: {
    type: Number,
    default: 10,
    min: [0, "Temu tokens cannot be negative"],
  },
  gatillaGold: {
    type: Number,
    default: 10,
    min: [0, "Gatilla Gold cannot be negative"],
  },
  wendyHearts: {
    type: Number,
    default: 10,
    min: [0, "Wendy Hearts cannot be negative"],
  },
  lastLoginDate: {
    type: Date,
    default: Date.now,
  },
  currentLoginStreak: {
    type: Number,
    default: 0,
    min: [0, "Login streak cannot be negative"],
  },
  longestLoginStreak: {
    type: Number,
    default: 0,
    min: [0, "Longest login streak cannot be negative"],
  },
  unlockedAbelPersonas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AbelPersonaBase", // We'll create this model later
    },
  ],
  activeAbelPersona: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AbelPersonaBase", // We'll create this model later
    default: null,
  },
  pokemonCollection: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserPokemon",
    },
  ],
  displayedPokemon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserPokemon",
    default: null,
  },
  snoopyArtCollection: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSnoopyArt",
    },
  ],
  displayedSnoopyArt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSnoopyArt",
    default: null,
  },
  yugiohCards: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserYugiohCard",
    default: null,
  },
  displayedYugiohCards: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserYugiohCard",
    default: null,
  },
  habboRares: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserHabboRare",
    },
  ],
  displayedHabboRares: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserHabboRare",
    default: null,
  },
  badges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserBadge",
    },
  ],
  titles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserTitle",
    },
  ],
  equippedTitle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTitle",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose Middlware

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// UserSchema.methods.getSignedJwtToken = function() {
//     return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE || '30d' // Configurable expiration
//     });
// };
// --- Cascading Delete Middleware ---
// When a User is removed, also remove their dependent documents.
// This is important for data integrity, as per your requirement.
UserSchema.pre("remove", async function (next) {
  console.log(`Removing dependent data for user <span class="math-inline">\{this\.email\} \(</span>{this._id})...`);
  // Example: Delete UserPokemon associated with this user
  // You would add similar lines for UserSnoopyArt, UserYugiohCard, UserHabboRare,
  // UserBadge, UserTitle, Habit, Task, Book, MediaItem, Note, WorkoutLog.
  // This requires importing those models once they are created.

  // await mongoose.model('UserPokemon').deleteMany({ user: this._id });
  // await mongoose.model('UserSnoopyArt').deleteMany({ user: this._id });
  // await mongoose.model('Habit').deleteMany({ user: this._id });
  // ... and so on for all user-specific data.

  // For Volumes, we need to update their author and status, not delete them.
  // This logic might be better handled in a service layer or controller upon user deletion.
  // For now, we'll just log it. We'll refine this cascading logic as we build models.
  console.log(`Volumes created by ${this.email} will need to be handled separately.`);
  next();
});

// Export the model
// mongoose.model('ModelName', Schema) compiles the schema into a model.
// A model is a constructor compiled from a Mongoose schema. Instances of these constructors represent documents which can be saved to and retrieved from MongoDB.
module.exports = mongoose.model("User", UserSchema);
