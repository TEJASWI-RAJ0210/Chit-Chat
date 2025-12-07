import mongoose,{Schema} from "mongoose";
const chatSchema = new Schema({
    participants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    ],
    lastMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null 

    }
},
{
timestamps: true
}
);
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;