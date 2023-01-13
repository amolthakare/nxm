const express = require("express");
const {NoteModel} = require("../models/notes.model");
// const noteRouter = express.Router();
require('dotenv').config();
const { Router } = require("express");
const noteRouter = Router();

noteRouter.get("/",(req,res)=>{
    res.send("notes");
})

noteRouter.post("/create",async(req,res)=>{
    const payload = req.body;
    try{
        const new_note = new NoteModel(payload);
        await new_note.save();
        res.send("note created");
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
    try{
        await NoteModel.deleteOne({_id: req.params.id});
        res.status(204).send();
    }
    catch(err){
        console.log(err);
        res.status(404);
        res.send({error:"Movie doesn't exsist"})
    }
    res.send("note deleted");
})

module.exports={
    noteRouter
}