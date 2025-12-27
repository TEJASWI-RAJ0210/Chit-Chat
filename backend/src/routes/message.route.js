import {Router} from 'express';
import Chat from '../models/chat.model.js'; 
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import { isObjectIdOrHexString } from 'mongoose';


const router = Router();
// Send a message
router.get("/:chatId", async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const messages = await Message.find({ chat: chatId }).populate("senderID", "fullName email username profilePic");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error });
    }
});
router.post("/", async (req, res) => {
    try {
        const { chatId, senderId, content } = req.body;
        const message = new Message({
            chat: chatId,
            sender: senderId,
            content
        });
        await message.save();
        await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });
        const populatedMessage = await Message.findById(message._id)
            .populate("senderID", "fullName email username profilePic");
        res.status(201).json(populatedMessage);
        io.to(chatId).emit("receive-message", populatedMessage);
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error });
    }
});

export default router;