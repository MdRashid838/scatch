const jwt = require("jsonwebtoken");
const userModel = require("../models/user-models");

module.exports = async function (req, resp, next) {
  if (!req.cookies.token) {
    resp.flash("error", "you need to login first");
    return resp.redirect("/");
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");
    req.user = user;
    next();
    // resp.render("/shop")
    // resp.send("/shop");
  } catch (err) {
    resp.flash("error", "something went wrong.");
    resp.redirect("/");
  }
};
