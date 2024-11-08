const express = require("express");
const router = express.Router();

router.get("/" , function (req, resp){
    resp.send("this is working")
})

module.exports = router;