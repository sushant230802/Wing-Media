const express = require('express');
const app= express();
const cookieParser=require("cookie-parser");
const path = require("path");

if(process.env.NODE_ENV !=="production"){
    require("dotenv").config({path: "./config/config.env"});
}

//using Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//importing routes
const post=require("./routes/post");  //import post from "./routes/post"
const user=require("./routes/user");

//using routes
app.use("/api/v1",post);
app.use("/api/v1",user);

module.exports = app;