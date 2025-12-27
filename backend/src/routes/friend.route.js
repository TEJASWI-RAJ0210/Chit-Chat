import { Router } from 'express';
import User from '../models/user.model.js';
import Chat from '../models/chat.model.js';

const router = Router();

// Search freinds
router.get("/search/:username", async (req, res) => {
    const user = await User.findOne({
        username: req.params.username.toLowerCase(),
        _id: { $ne: req.userId }
    }).select("username profilePicture");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
});

// send friend request
router.post("/request/:receiverId", async (req, res) => {
    const receiver = await User.findById(req.params.receiverId);
    const sender = await User.findById(req.userId);

    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    receiver.friendRequests.received.addToSet(req.userId);
    sender.friendRequests.sent.addToSet(receiver._id);

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: "Friend request sent" });
});

//accept friend request
router.post("/accept/:senderId", async (req, res) =>{
    const sender = await User.findById(req.params.senderId);
    const receiver = await User.findById(req.userId);

    sender.friends.push(receiver._id);
    receiver.freinds.push(sender._id);

    receiver.friendRequests.received.pull(sender._id);
    sender.friendRequests.sent.pull(receiver._id);

    await sender.save();
    await receiver.save();

    res.json({message:"Friend request accepted"});

});

//Reject request
router.post("/reject/:senderId", async (req, res) => {
    const receiver = await User.findById(req.userId);

    receiver.friendRequests.received.pull(req.params.senderId);
    await receiver.save();

    res.json({message: "Request rejected"});
});

export default router;