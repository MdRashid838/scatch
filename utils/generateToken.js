const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not found in environment variables");
  }

  return jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_KEY,
    { expiresIn: "7d" } // token valid for 7 days
  );
};

module.exports = generateToken;

