import {Router} from 'express';
import Chat from '../models/chat.model.js'; 
import User from '../models/user.model.js';
import Message from '../models/message.model.js';

const router = Router();
// Send a message
router.post("/", async (req, res) => {
    try {
        const { chatId, senderId, content } = req.body;
        const message = new Message({
            chat: chatId,
            sender: senderId,
            content
        });
        await message.save();
        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "fullName email username profilePic");
        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error });
    }
});

export default router;