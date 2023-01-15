const express = require("express");
const mongoose = require("mongoose")
const {connection} = require("./config/db");
require('dotenv').config();
const cors = require("cors");
const {authenticate} = require("./middleware/authenticate.middleware");

const route = require("./routes/routes");
const {noteRouter} = require("./routes/notes.routes");

const app = express();
app.use(cors({origin:"*"}));
app.use(express.json());

app.use("/",route);
app.use(authenticate);
app.use("/notes",noteRouter);

app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("connected");
    }
    catch(err){
        console.log(err);
    }
    console.log("listening to port 4500");
})