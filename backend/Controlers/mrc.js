import Conversation from "../model/conversationModels.js";

import Message from '../model/messageSchema.js';
import { getReciverSocketId,io } from "../Socket/socket.js";


// mssg store in the database
export const sendMessage = async(req,res)=>{
    try{

        const {messages} = req.body;
        const {id:receiverId}= req.params;
        const senderId = req.user._id;

// if chat already going on between two particular user, then continue in that chat, dont need to create new chat
        let chats = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        });
        if(!chats){
            chats = await Conversation.create({
                participants:[senderId, receiverId]
            });
        }

        const newMessages = new Message({
            senderId,
            receiverId,
            message:messages,
            consversationId:chats._id
        })

        if(newMessages){
            chats.messages.push(newMessages._id)
        }


        
        // SOCKET.IO Function
        await Promise.all([chats.save(),newMessages.save()]);

        // SOCKET.IO Function

        const reciverSocketId = getReciverSocketId(receiverId);
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage", newMessages)
        }



        res.status(201).json(newMessages)
    }catch(error){
        console.error('Error in sendMessage:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// ---------------------------------------------------------------------


// mssg show on the body
export const getMessages = async(req,res)=>{
    try{
        const {id:receiverId}= req.params;
        const senderId = req.user._id;

        const chats = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate("messages")

        // if there is no mssg in the chat then return an empty array
        if(!chats) return res.status(200).send([]);
        
        const message = chats.messages;
        res.status(200).send(message)

    }catch(error){
        res.status(500).send({
            success: false,
            message: error
        });
        console.log(error);
    }
}