// const mongoose = require('mongoose');
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbConnect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_CONNECT),
        console.log("DB Connected Succesfully");
    } catch (error){
        console.log(error);
    }
}


export default dbConnect;