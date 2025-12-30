import { Router } from 'express';
import User from '../models/user.model.js';
import Chat from '../models/chat.model.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Search freinds
router.get("/search/:username",protect, async (req, res) => {
    try{
        const keyword = req.params.username.toLowerCase();
    const user = await User.findOne({
        username: keyword,
        _id: { $ne: req.userId }
    }).select("username profilePicture");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
    }catch{
        res.status(500).json({ message: "Server error" });
    }
});

// send friend request
router.post("/request/:receiverId",protect, async (req, res) => {
    const receiver = await User.findById(req.params.receiverId);
    const sender = await User.findById(req.userId);

    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    receiver.friendRequests.received.addToSet(req.userId);
    sender.friendRequests.sent.addToSet(receiver._id);

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: "Friend request sent" });
});

// Get incoming friend requests for current user
router.get('/requests', protect, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate('friendRequests.received', 'username profilePic');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.friendRequests.received || []);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

//accept friend request
router.post("/accept/:senderId",protect, async (req, res) =>{
    const sender = await User.findById(req.params.senderId);
    const receiver = await User.findById(req.userId);

    sender.friends.push(receiver._id);
    receiver.friends.push(sender._id);

    receiver.friendRequests.received.pull(sender._id);
    sender.friendRequests.sent.pull(receiver._id);

    await sender.save();
    await receiver.save();

    // ensure a chat exists between the two users
    try {
        let chat = await Chat.findOne({ participants: { $all: [sender._id, receiver._id] } });
        if (!chat) {
            chat = new Chat({ participants: [sender._id, receiver._id] });
            await chat.save();
            chat = await Chat.findById(chat._id).populate('participants', 'fullName email username profilePic');
        }

        res.json({ message: "Friend request accepted", chat });
    } catch (err) {
        // even if chat creation fails, return success for accepting
        console.error('Chat creation error:', err);
        res.json({ message: "Friend request accepted" });
    }

});

//Reject request
router.post("/reject/:senderId",protect, async (req, res) => {
    const receiver = await User.findById(req.userId);

    receiver.friendRequests.received.pull(req.params.senderId);
    await receiver.save();

    res.json({message: "Request rejected"});
});

export default router;