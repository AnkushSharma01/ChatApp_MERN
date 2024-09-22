// Now create Schema for user1 and user2


import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
    participants:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        }
    ],
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
            default:[]
        }
    ]
},{Timestamp:true})

const Conversation = mongoose.model('Conversation',conversationSchema)

export default Conversation;