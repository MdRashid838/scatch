const mongoose = require('mongoose');
// require("dotenv").config();
// const dbgr = require("debug")("app:db");

// const mongoURI = process.env.MONGODB_URI;

// mongoose.connect(`${mongoURI}/scatch`)
//   .then(() => dbgr("✅ MongoDB connected"))
//   .catch(err => dbgr("❌ MongoDB connection error:", err));

// module.exports = mongoose.connection;


const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function connectMongoDB() {
  try {
    const dbUrl = process.env.MONGO_URL;

    if (!dbUrl) {
      console.error(" MONGO_URL is missing in .env file");
      return;
    }

    await mongoose.connect(dbUrl);

    console.log(" MongoDB Atlas Connected Successfully!");
  } catch (err) {
    console.error(" MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}

module.exports = connectMongoDB;

