const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1);
  }
};

const listUsers = async () => {
  try {
    const users = await User.find().select("username email");
    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email})`);
    });
  } catch (error) {
    console.error("Error listing users:", error);
  }
};

const run = async () => {
  await connectDB();
  await listUsers();
  await mongoose.disconnect();
};

run();
