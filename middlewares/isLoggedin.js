const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, resp, next) {
  const token = req.cookies?.token;

  if (!token) {
    req.flash("error", "You need to login first");
    return resp.redirect("/");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");

    if (!user) {
      req.flash("error", "User not found, please login again");
      return resp.redirect("/");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    req.flash("error", "Session expired or invalid token");
    resp.redirect("/");
  }
};
