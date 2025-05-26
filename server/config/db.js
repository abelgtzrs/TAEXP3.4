// server/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6 no longer needs these, but good to be aware if using older versions:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true, // Not needed
      // useFindAndModify: false // Not needed
    });
    console.log(`DB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to DB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
