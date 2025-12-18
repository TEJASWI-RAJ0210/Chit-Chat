import {Router} from 'express';
import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';

const router = Router();  
router.post("/", async (req, res) => {
    try {
        const { userId1, userId2 } = req.body;
        let chat = await Chat.findOne({
            participants: { $all: [userId1, userId2] }
        }).populate("participants", "fullName email username profilePic")
          .populate({   
            path: "messages",
            options: { sort: { createdAt: -1 }, limit: 1 },
            populate: {
                path: "sender",
                select: "fullName email username profilePic"
            }
        });
        if (!chat) {
            chat = new Chat({
                participants: [userId1, userId2]
            });
            await chat.save();
            chat = await Chat.findById(chat._id).populate("participants", "fullName email username profilePic");
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: "Error creating or fetching chat", error });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const chats = await Chat.find({
            participants: userId
        })
        .populate("participants", "fullName email username profilePic")
        .populate({
            path: "messages",
            options: { sort: { createdAt: -1 }, limit: 1 },
            populate: {
                path: "sender",
                select: "fullName email username profilePic"
            }
        });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching chats", error });
    }
});

export default router;