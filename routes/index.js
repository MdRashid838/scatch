const express = require("express")
const router = express();
const isLoggedin = require("../middlewares/isLoggedin")


router.get('/', function (req, resp){
    let error = req.flash("error")
    resp.render("index" ,{ error});
})

router.get('/shop',isLoggedin, function (req, resp){
    resp.render("shop");
})


module.exports = router;