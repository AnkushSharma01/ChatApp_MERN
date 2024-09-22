import User from "../model/userModules.js";
import Conversation from "../model/conversationModels.js";
export const getUserBySearch = async(req,res)=>{
    try{
        const search = req.query.search || '';
        const currentUserID = req.user._id;
        const user = await User.find({
            $and:[
                {
                    $or:[
                        { username: { $regex: search, $options: 'i' } },
                        { fullname: { $regex: search, $options: 'i' } }
                    ]
                },{
                    _id:{$ne:currentUserID}
                }
            ]
        }).select("-password").select("email")

        res.status(200).send(user)
    }catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}


// -------------------------------------------------------------

// export const getCorrentChatters = async(req,res)=>{
//     try{

//         // get currentId
//         const currentUserID = req.user._id;
//         const currentchatters = await Conversation.find({

//             // sort on the basis of recent chat
//             participants: currentUserID
//         }).sort({
//             updatedAt: -1
//         });

//         // if there is no conversation, send an empty array
//         if(!currentchatters || currentchatters.length ===0) return res.status(200).send([]);


//         const participantsIDS = currentchatters.reduce((ids,conversation)=>{

//             // filter recent chat
//             const otherParticipents = conversation.participants.filter(id=> id !== currentUserID);
//             return [...ids, ...otherParticipents]
//         },[])

//         // convert object into string
//         const otherParticipentsIDS = [...new Set(participantsIDS.map(id => id.toString()))]; 
//         // participantsIDS.filter(id =>id.toString() !== currentUserID.toString());

//         const user = await User.find({_id:{$in:otherParticipentsIDS}}).select("-password").select("-email");

//         // send on frontend
//         const users = otherParticipentsIDS.map(id => user.find(user => user._id.toString() === id)).filter(user =>user);

//         res.status(200).send(users);
//     }catch(error){
//         res.status(500).send({
//             success: false,
//             message: error
//         })
//         console.log(error);
//     }
// }


export const getCorrentChatters = async (req, res) => {
    try {
        // Get current user ID
        const currentUserID = req.user._id;

        // Find conversations where the current user is a participant
        const currentchatters = await Conversation.find({
            participants: currentUserID
        }).sort({ updatedAt: -1 });

        // If no conversations, return an empty array
        if (!currentchatters || currentchatters.length === 0) {
            return res.status(200).send([]);
        }

        // Extract participant IDs excluding the current user
        const participantsIDS = currentchatters.reduce((ids, conversation) => {
            if (!Array.isArray(conversation.participants)) {
                console.warn('Conversation participants is not an array:', conversation.participants);
                return ids;
            }

            const otherParticipants = conversation.participants
                .filter(id => id && id.toString() !== currentUserID.toString()); // Ensure ID is valid
            return [...ids, ...otherParticipants];
        }, []);

        // Ensure participant IDs are unique and valid
        const uniqueParticipantsIDS = [...new Set(participantsIDS.map(id => id ? id.toString() : null).filter(id => id))];

        // Fetch users based on the unique participant IDs
        const users = await User.find({
            _id: { $in: uniqueParticipantsIDS }
        }).select("-password -email");

        // Map the users to ensure the correct user data is sent
        const mappedUsers = uniqueParticipantsIDS.map(id =>
            users.find(user => user._id.toString() === id)
        ).filter(user => user); // Remove any undefined values

        // Send the users data as response
        res.status(200).send(mappedUsers);
    } catch (error) {
        console.error('Error in getCorrentChatters:', error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
