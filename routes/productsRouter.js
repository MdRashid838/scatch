const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const Product = require("../models/product-model");

// ✅ Create product route
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

    if (!name || !price) {
      return res.status(400).send("Name and price are required.");
    }

    const product = await Product.create({
      image: req.file?.buffer,
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
    });

    if (typeof req.flash === "function") {
      req.flash("success", "Product created successfully.");
    }

    if (req.headers.accept?.includes("application/json")) {
      return res.status(201).json({ success: true, product });
    }

    res.redirect("/owners/admin");
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).send(err.message || "Something went wrong");
  }
});

module.exports = router;
