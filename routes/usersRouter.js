const express = require("express");
const router = express.Router();
const {registerUser, loginUser} = require("../controllers/authController")

router.get("/" , function (req, resp){
    resp.send("this is working usermodel")
})
// console.log(process.env.NODE_ENV)

router.post("/register" , registerUser )
router.post("/login" , loginUser )

module.exports = router;