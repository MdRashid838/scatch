const userModel = require("../models/user-models");
const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");
const {generateToken} = require("../utils/generateToken")


module.exports.registerUser = async function (req, resp){
    try{
        let{ fullname,email, password } = req.body;

        let user = await userModel.findOne({email:email});
        if(user) {
            return resp.status(401).send("you already have an account, please login")
        };


        bcrypt.genSalt(10, function(err,salt){
            bcrypt.hash(password, salt, async function(err,hash){
                if(err){ 
                    return resp.send(err.massage)
                }
                else {
                    let user = await userModel.create({
                        fullname,
                        email,
                        password: hash,
                    });
                    let token = generateToken(user);
                    resp.cookie("token", token);
                    resp.send("user created successfully");
                }
            });
        });
       
    }
    catch(err){
        console.log(err)
    }
}

module.exports.loginUser = async function(req, resp){
    let {email ,password} = req.body;

    let user = await userModel.findOne({email:email});
    if(!user){
         return resp.send("Email or Password incorrect")
        };

    bcrypt.compare(password, user.password, function(err, result){
        if(result){
        let token = generateToken(user);
        resp.cookie("token",token);
        resp.send("you can login")
    }else{
        return resp.send("Email or Password incorrect")
    }
    });
};