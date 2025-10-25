import dotenv from "dotenv";
import connectDB from "./db/index.js";
import cors from "cors";
import authRouter from './routes/Auth.route.js';
import {app} from "./app.js"
import express from "express";
dotenv.config({
    path: './.env'
})



connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`process.env.PORT : ${process.env.PORT || 5000}`)
    })
})
.catch((err) => {
    console.log("MONOGODB connection failed !!!",err);
    process.exit(1);
})
