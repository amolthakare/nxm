const express = require("express");
const mongoose = require("mongoose");
const {connection} = require("../config/db");
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require('dotenv').config();
const routes = express.Router();

routes.post("/register",async(req,res)=>{
    const {name,email,pass,age} = req.body;
    try{
        bcrypt.hash(pass, 5, async(err, secure_password)=> {
            if(err){
                console.log(err);
            }
            else{
                const user = new UserModel({name,email,pass:secure_password,age});
                await user.save();
            }
        });
        res.send("registered");
    }
    catch(err){
        res.send("error in registered");
        console.log(err);
    }
})

routes.post("/login",async(req,res)=>{
    const {email,pass} = req.body;
    try{
        const user = await UserModel.find({email});
        
        if(user.length>0){
            bcrypt.compare(pass, user[0].pass, function(err, result) {
                if(result){
                    const token = jwt.sign({ userID:user[0]._id }, process.env.key);
                    res.send({"msg":"logged in","token":token});
                }
                else{
                    res.send("wrong credentials")
                }
            });
            
        }
        else{
            res.send("err");
        } 
    }
    catch(err){
        res.send("error in login");
        console.log(err);
    }
})

routes.get("/",(req,res)=>{
    res.send("homepage")
})

routes.get("/about",(req,res)=>{
    const token = req.query.token;
    jwt.verify(token, 'masai', (err, decoded)=> {
        if(err){
            res.send("login again");
            console.log(err);
        }
        else{
            res.send("data");
        }
        console.log(decoded.foo) // bar
    });
    res.send("about")
})

routes.get("/cart",(req,res)=>{
    res.send("cart")
})

module.exports=routes;