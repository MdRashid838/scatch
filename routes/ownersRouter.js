const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-models")
// console.log(process.env.NODE_ENV)

if(process.env.NODE_ENV ==="development"){
    router.post("/create" , async function (req, resp){
        let owners = await ownerModel.find();
            if(owners.length > 0){
                return resp
                .status(503)
                .send("You don't have permission to create a new owner.")
            }
            let {fullname, email, password} = req.body;
            let createdOwner = await ownerModel.create({
                fullname,
                email,
                password,
            })
            resp.status(201).send(createdOwner);
    })
}

router.get("/admin" , function (req, resp){
    resp.render("createproducts")
})
module.exports = router;



// this command to check current enviroment  "console.log(process.env.NODE_ENV)"
// setup new environment variable  = "$env:NODE_ENV="development""
// Remove-Item Env:NODE_ENV
// $env:DEBUG="development:*" for setup debug command
