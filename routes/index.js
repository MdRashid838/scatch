const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const Product = require("../models/product-model");
const User = require("../models/user-model");

// HOME
router.get("/", (req, res) => {
  const error = req.flash("error");
  res.json({
    message: "API running 🚀",
    error,
    loggedin: false,
  });
});

// SHOP
router.get("/shop", isLoggedin, async (req, res) => {
  const products = await Product.find();
  const success = req.flash("success");

  res.json({
    products,
    success,
  });
});

// CART
router.get("/cart", isLoggedin, async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).populate("cart");

  let bill = 0;
  if (user.cart.length > 0) {
    bill = user.cart.reduce(
      (acc, item) => acc + (item.price - (item.discount || 0)),
      20
    );
  }

  res.json({
    user,
    bill,
  });
});

// ADD TO CART
router.post("/addtocart/:productid", isLoggedin, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();

  res.json({
    success: true,
    message: "Added to cart successfully!",
  });
});

// LOGOUT
router.post("/logout", isLoggedin, (req, res) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out successfully!",
  });
});

module.exports = router;
