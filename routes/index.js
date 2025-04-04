const express = require("express")
const router = express();
const isLoggedin = require("../middlewares/isLoggedin");
const productModels = require("../models/product-models");
const { render } = require("ejs");
const userModels = require("../models/user-models");


router.get('/', function (req, resp){
    let error = req.flash("error")
    resp.render("index" ,{ error, loggedin : false});
});

router.get('/shop',isLoggedin, async function (req, resp){
    let products = await productModels.find();
    let success = req.flash("success");
    resp.render("shop" , {products , success});
});

router.get('/cart',isLoggedin, async function (req, resp){
    let user = await userModels.findOne({email : req.user.email}).populate("cart");
    let bill = Number(user.cart[0].price) + 20 - Number(user.cart[0].discount)
    resp.render("cart" ,{user , bill});
});

router.get('/addtocart/:productid',isLoggedin, async function (req, resp){
   let user = await userModels.findOne({email : req.user.email});
   user.cart.push(req.params.productid);
   await user.save();
   req.flash("success", "Add To Cart");
   resp.redirect("/shop");
});

// ruoter.get("/logout", isLoggedin, function (req, resp) {
//     resp.render("shop")
// });

module.exports = router;

// // routes/index.js
// const express = require('express');
// const router = express.Router();
// const productModel = require('../models/product-models'); // Corrected path

// router.get('/shop', async (req, res) => {
//     try {
//         const products = await productModel.find({}); // Fetch all products
//         res.render('shop', { products: products }); // Pass products to the template
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).send("Error fetching products");
//     }
// });

// router.get('/', (req, res) => {
//     res.render("index");
//     // res.render("shop");
// });

// module.exports = router;