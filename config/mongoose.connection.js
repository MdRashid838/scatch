const mongoose = require('mongoose');
require("dotenv").config();
const dbgr = require("debug")("app:db");

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(`${mongoURI}/scatch`)
  .then(() => dbgr("✅ MongoDB connected"))
  .catch(err => dbgr("❌ MongoDB connection error:", err));

module.exports = mongoose.connection;
