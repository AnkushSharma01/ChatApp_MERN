import dbConnect from './DB/dbConnect.js';
import express from 'express';
import dotenv from 'dotenv';
import authRouter from './route/authUser.js';
import messageRouter from './route/messageRoute.js';
import cookieParser from 'cookie-parser';
import userRouter from './route/userRout.js';
import path from 'path';


// Now, as I Know socket.io work above the express server, so we to replace it with socket.io server
// const app = express();

import {app, server} from './Socket/socket.js'

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRouter);
app.use('/api/message',messageRouter)
app.use('/api/user',userRouter)

app.use(express.static(path.join(__dirname,"/frontend/dist")))


app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
});

const PORT = process.env.PORT || 3000;


// Replace app with server
// app.listen(PORT,()=>{

    server.listen(PORT,()=>{
    dbConnect();
    console.log(`Running at ${PORT}` );
})