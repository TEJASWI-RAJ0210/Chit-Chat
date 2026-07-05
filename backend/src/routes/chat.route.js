import { Router } from 'express';
import mongoose   from 'mongoose';
import Chat       from '../models/chat.model.js';
import Message    from '../models/message.model.js';

const router = Router();

// POST /api/chat — create or fetch existing chat
router.post('/', async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    let chat = await Chat.findOne({ participants: { $all: [userId1, userId2] } })
      .populate('participants', 'fullName email username profilePic')
      .populate({ path: 'lastMessage', populate: { path: 'senderID', select: 'fullName username profilePic' } });

    if (!chat) {
      chat = new Chat({ participants: [userId1, userId2] });
      await chat.save();
      chat = await Chat.findById(chat._id)
        .populate('participants', 'fullName email username profilePic');
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating or fetching chat', error: error.message });
  }
});

// GET /api/chat/:userId — fetch chats with unread counts
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'fullName email username profilePic')
      .populate({ path: 'lastMessage', populate: { path: 'senderID', select: 'fullName username profilePic' } })
      .sort({ updatedAt: -1 });

    // ✅ Single aggregation to get unread counts for ALL chats at once
    const chatIds    = chats.map((c) => c._id);
    const viewerId   = new mongoose.Types.ObjectId(userId);

    const unreadAgg = await Message.aggregate([
      {
        $match: {
          chatID:   { $in: chatIds },
          senderID: { $ne: viewerId },  // messages NOT sent by this user
          isSeen:   false,
        },
      },
      {
        $group: {
          _id:   '$chatID',
          count: { $sum: 1 },
        },
      },
    ]);

    // Build lookup: chatId string → unread count
    const unreadMap = {};
    unreadAgg.forEach(({ _id, count }) => {
      unreadMap[String(_id)] = count;
    });

    // Attach unreadCount to each chat
    const result = chats.map((chat) => ({
      ...chat.toObject(),
      unreadCount: unreadMap[String(chat._id)] || 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
});

export default router;