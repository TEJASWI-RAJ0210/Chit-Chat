import mongoose,{Schema} from "mongoose";
const aiSchema = new Schema({
    messageid:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Message"
    },
    responseText:{
        type: String,
        required: true
    },
    sentiment:{
        type: String,
        enum: ["positive", "neutral", "negative"],
        default: "neutral"
    },
    contextHistory:{
        type: [String],
        default: [],
        summary:String
    },
    intent:{
        type: String,
        enum: ["question", "command", "statement", "greeting", "farewell", "other"],
        default: "other"
    },
    flags:{
        isToxic:Boolean,
        isSpam:Boolean,
        isOffensive:Boolean
    }
},
{
 timestamps: true
});

const AIResponse = mongoose.model("AIResponse", aiSchema);

export default AIResponse;  

