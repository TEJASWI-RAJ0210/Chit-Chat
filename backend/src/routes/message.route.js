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
        const messages = await Message.find({ chatID: chatId }).populate("senderID", "fullName email username profilePic");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error: error.message || error });
    }
});
router.post("/", async (req, res) => {
    try {
        const { chatId, chatID, senderId, senderID, content, text } = req.body;
        const chat = chatId || chatID;
        const sender = senderId || senderID;
        const messageText = content || text;

        const message = new Message({
            chatID: chat,
            senderID: sender,
            text: messageText
        });
        await message.save();
        await Chat.findByIdAndUpdate(chat, { lastMessage: message._id });
        const populatedMessage = await Message.findById(message._id)
            .populate("senderID", "fullName email username profilePic");
        res.status(201).json(populatedMessage);
        const io = req.app.get('io');
        if (io) io.to(String(chat)).emit("receive-message", populatedMessage);
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error: error.message || error });
    }
});

export default router;