// // src/routes/messageRoutes.js
// import { Router } from 'express';
// import Chat from '../models/chat.model.js';
// import Message from '../models/message.model.js';
// import { analyzeSentiment } from '../utils/Sentiment.js';

// const router = Router();

// // GET /api/messages/:chatId — fetch messages for a chat
// router.get('/:chatId', async (req, res) => {
//   try {
//     const messages = await Message.find({ chatID: req.params.chatId })
//       .populate('senderID', 'fullName email username profilePic');
//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching messages', error: error.message });
//   }
// });

// // POST /api/messages — send a text OR file message
// router.post('/', async (req, res) => {
//   try {
//     const { chatId, chatID, senderId, senderID, content, text, fileUrl, fileName, fileType, messageType } = req.body;

//     const chat        = chatId    || chatID;
//     const sender      = senderId  || senderID;
//     const messageText = content   || text || '';

//     // Validate — must have either text or a file
//     if (!messageText && !fileUrl) {
//       return res.status(400).json({ message: 'Message must have text or a file.' });
//     }

//     // Only run sentiment on text messages
//     let sentiment = { score: 0, label: 'neutral' };
//     if (messageText) {
//       const result = analyzeSentiment(messageText);
//       sentiment = { score: result.score, label: result.label };
//     }

//     // Determine messageType
//     const type = messageType || (fileUrl ? fileType || 'file' : 'text');

//     const message = new Message({
//       chatID:      chat,
//       senderID:    sender,
//       text:        messageText,
//       fileUrl:     fileUrl   || null,
//       fileName:    fileName  || null,
//       fileType:    fileType  || null,
//       messageType: type,
//       sentiment,
//     });

//     await message.save();

//     // Update chat's lastMessage
//     await Chat.findByIdAndUpdate(chat, { lastMessage: message._id });

//     const populated = await Message.findById(message._id)
//       .populate('senderID', 'fullName email username profilePic');

//     // Emit via socket for real-time delivery
//     const io = req.app.get('io');
//     if (io) io.to(String(chat)).emit('receiveMessage', populated);

//     return res.status(201).json(populated);
//   } catch (error) {
//     console.error('Send message error:', error);
//     res.status(500).json({ message: 'Error sending message', error: error.message });
//   }
// });

// export default router;

import { Router } from 'express';
import Chat    from '../models/chat.model.js';
import Message from '../models/message.model.js';
import { analyzeSentiment } from '../utils/Sentiment.js';

const router = Router();

// GET /api/messages/:chatId
router.get('/:chatId', async (req, res) => {
  try {
    const messages = await Message.find({ chatID: req.params.chatId })
      .populate('senderID', 'fullName email username profilePic');
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
});

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const {
      chatId, chatID, senderId, senderID,
      content, text, fileUrl, fileName, fileType, messageType,
    } = req.body;

    const chat        = String(chatId    || chatID);
    const sender      = String(senderId  || senderID);
    const messageText = content || text || '';

    if (!messageText && !fileUrl) {
      return res.status(400).json({ message: 'Message must have text or a file.' });
    }

    let sentiment = { score: 0, label: 'neutral' };
    if (messageText) {
      const r  = analyzeSentiment(messageText);
      sentiment = { score: r.score, label: r.label };
    }

    const type = messageType || (fileUrl ? fileType || 'file' : 'text');

    const message = new Message({
      chatID: chat, senderID: sender,
      text: messageText,
      fileUrl: fileUrl || null, fileName: fileName || null,
      fileType: fileType || null, messageType: type,
      sentiment,
    });

    await message.save();
    await Chat.findByIdAndUpdate(chat, { lastMessage: message._id });

    const populated = await Message.findById(message._id)
      .populate('senderID', 'fullName email username profilePic');

    // ── Emit to ALL participants directly by socket ID ──────────
    // This is more reliable than rooms because it doesn't require
    // the client to have called joinChat first.
    const io          = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers'); // Map: userId → socketId

    if (io) {
      // Also emit to room as a fallback
      io.to(chat).emit('receiveMessage', populated);

      // Direct emit to each participant's socket
      try {
        const chatDoc = await Chat.findById(chat).select('participants');
        if (chatDoc && onlineUsers) {
          for (const participantId of chatDoc.participants) {
            const pid      = String(participantId);
            const socketId = onlineUsers.get(pid);
            if (socketId) {
              io.to(socketId).emit('receiveMessage', populated);
              console.log(`📤 Direct emit → user ${pid} socket ${socketId}`);
            }
          }
        }
      } catch (e) {
        console.error('Direct emit failed:', e.message);
      }
    }

    return res.status(201).json(populated);
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
});

router.put("/:chatId/seen", async (req, res) => {
  try {

    const { userId } = req.body;
    const unseenMessages = await Message.find({
      chatID: req.params.chatId,
      senderID: { $ne: userId },
      isSeen: false,
    });

    await Message.updateMany(
      {
        _id: {
          $in: unseenMessages.map((m) => m._id),
        },
      },
      {
        isSeen: true,
        seenAt: new Date(),
      }
    );

     const io = req.app.get("io");

    io.to(req.params.chatId).emit("messages-seen", {
      messageIds: unseenMessages.map(m => m._id),
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

export default router;
