const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");

// ✅ Development test route (disabled in production)
if (process.env.NODE_ENV !== "production") {
  router.get("/", (req, res) => {
    res.send("✅ User router working properly");
  });
}

// ✅ Register user
router.post("/register", registerUser);

// ✅ Login user
router.post("/login", loginUser);

// ✅ Logout user
router.get("/logout", logoutUser);

module.exports = router;
