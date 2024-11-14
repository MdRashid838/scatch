const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/user-models")

router.post("/create", upload.single("image"), async function (req, resp) {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor, } = req.body;
        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        })
        resp.send("product");
    } catch (err) {
        resp.send(err.massage);
    }
})

module.exports = router;