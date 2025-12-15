const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, resp) {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return resp.status(400).send("User already exists, please login.");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      fullname,
      email,
      password: hash,
    });

    const token = generateToken(user);
    if (!token) return resp.status(500).send("Token generation failed");

    resp.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    resp.status(201).send("User created successfully");
  } catch (err) {
    console.error(err);
    resp.status(500).send("Internal Server Error");
  }
};

module.exports.loginUser = async function (req, resp) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return resp.status(401).send("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return resp.status(401).send("Invalid email or password");

    const token = generateToken(user);
    resp.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    // resp.render("users/login/shop"); // uncomment if using views
    resp.status(200).send("Login successful");
  } catch (err) {
    console.error(err);
    resp.status(500).send("Internal Server Error");
  }
};

module.exports.logoutUser = async function (req, resp) {
  resp.clearCookie("token");
  resp.redirect("/");
};
