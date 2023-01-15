const express = require("express");
const {NoteModel} = require("../models/notes.model");
// const noteRouter = express.Router();
require('dotenv').config();
const { Router } = require("express");
const noteRouter = Router();

noteRouter.get("/",async(req,res)=>{
    const result = await NoteModel.find();
    res.send(result);
})

noteRouter.post("/create",async(req,res)=>{
    const payload = req.body;
    try{
        const new_note = new NoteModel(payload);
        await new_note.save();
        res.send(new_note);
    }
    catch(err){
        console.log(err);
        res.send("err");
    }
    
    
})

noteRouter.patch("/update/:id",async(req,res)=>{
    const payload = req.body;
    const id = req.params.id;
    const note = await NoteModel.findOne({"_id":id});
    const userID_in_note = note.userID;
    const userID_making_req = req.body.userID;
    try{
        if(userID_making_req!==userID_in_note){
            res.send({"msg":"you are not authorized"});
        }
        else{
            await NoteModel.findByIdAndUpdate({"_id":id},payload);
            res.send("Updated the note")
        }
    }
    catch(err){
        console.log(err);
        res.status(404);
        res.send({error:"note doesn't exsist"})
    }
})

noteRouter.delete("/delete/:id",async(req,res)=>{
    const payload = req.body;
    const id = req.params.id;
    const note = await NoteModel.findOne({"_id":id});
    const userID_in_note = note.userID;
    const userID_making_req = req.body.userID;
    try{
        if(userID_making_req!==userID_in_note){
            res.send({"msg":"you are not authorized"});
        }
        else{
            await NoteModel.findByIdAndDelete({"_id":id});
            res.send("note deleted");
        }
    }
    catch(err){
        console.log(err);
        res.status(404);
        res.send({error:"note doesn't exsist"})
    }
})

module.exports={
    noteRouter
}