const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Owner = require("../models/owner-model");

// ✅ Create new owner (allowed only in dev/setup)
router.post("/create", async (req, res) => {
  try {
    if (process.env.NODE_ENV !== "development" && process.env.ALLOW_OWNER_SETUP !== "true") {
      return res.status(403).send("Owner creation is disabled in this environment.");
    }

    const existingOwners = await Owner.find();
    if (existingOwners.length > 0) {
      return res.status(409).send("Owner already exists.");
    }

    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).send("All fields (fullname, email, password) are required.");
    }

    const hash = await bcrypt.hash(password, 10);
    const createdOwner = await Owner.create({ fullname, email, password: hash });
    res.status(201).json(createdOwner);
  } catch (error) {
    console.error("Error creating owner:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Get all owners
router.get("/", async (req, res) => {
  try {
    const owners = await Owner.find();
    res.status(200).json(owners);
  } catch (error) {
    console.error("Error fetching owners:", error);
    res.status(500).send("Error fetching owners");
  }
});

// ✅ Delete all owners (dev only)
router.delete("/delete-all", async (req, res) => {
  try {
    if (process.env.NODE_ENV !== "development" && process.env.ALLOW_OWNER_SETUP !== "true") {
      return res.status(403).send("You don't have permission to delete owners in production.");
    }

    await Owner.deleteMany({});
    res.status(200).send("All owners deleted successfully.");
  } catch (error) {
    console.error("Error deleting owners:", error);
    res.status(500).send("Error deleting owners");
  }
});

module.exports = router;
