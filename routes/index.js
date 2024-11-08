const express = require("express")
const router = express.router();

router.get('/', function (req, resp){
    let error = req.flash("error")
    resp.render("index" ,{ error});
})

module.exports = router;