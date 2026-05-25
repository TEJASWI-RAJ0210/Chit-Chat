import mongoose,{Schema} from "mongoose";
const messageSchema = new Schema({
    chatID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Chat"

    },
    senderID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    text:{
        type: String,
        required: true, 
        trim: true
    },
    sentiment:{
        score:{
            type: Number,
            default: 0
        
        },
        label:{
            type: String,
            enum: ["positive", "neutral", "negative"],
            default: "neutral"
        }
    }    },
{
 timestamps: true
}

);
const Message = mongoose.model("Message", messageSchema);
export default Message;