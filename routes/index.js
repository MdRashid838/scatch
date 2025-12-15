const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const Product = require("../models/product-model");
const User = require("../models/user-model");

router.get("/", (req, resp) => {
  const error = req.flash("error");
  resp.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedin, async (req, resp) => {
  const products = await Product.find();
  const success = req.flash("success");
  resp.render("shop", { products, success });
});

router.get("/cart", isLoggedin, async (req, resp) => {
  const user = await User.findOne({ email: req.user.email }).populate("cart");
  let bill = 0;
  if (user.cart.length > 0) {
    bill = user.cart.reduce((acc, item) => acc + (item.price - (item.discount || 0)), 20);
  }
  resp.render("cart", { user, bill });
});

router.get("/addtocart/:productid", isLoggedin, async (req, resp) => {
  const user = await User.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added to cart successfully!");
  resp.redirect("/shop");
});

router.get("/logout", isLoggedin, (req, resp) => {
  resp.clearCookie("token");
  req.flash("success", "Logged out successfully!");
  resp.redirect("/");
});

module.exports = router;
