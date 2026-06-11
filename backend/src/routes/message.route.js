// src/routes/messageRoutes.js
import { Router } from 'express';
import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';
import { analyzeSentiment } from '../utils/Sentiment.js';

const router = Router();

// GET /api/messages/:chatId — fetch messages for a chat
router.get('/:chatId', async (req, res) => {
  try {
    const messages = await Message.find({ chatID: req.params.chatId })
      .populate('senderID', 'fullName email username profilePic');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// POST /api/messages — send a text OR file message
router.post('/', async (req, res) => {
  try {
    const { chatId, chatID, senderId, senderID, content, text, fileUrl, fileName, fileType, messageType } = req.body;

    const chat        = chatId    || chatID;
    const sender      = senderId  || senderID;
    const messageText = content   || text || '';

    // Validate — must have either text or a file
    if (!messageText && !fileUrl) {
      return res.status(400).json({ message: 'Message must have text or a file.' });
    }

    // Only run sentiment on text messages
    let sentiment = { score: 0, label: 'neutral' };
    if (messageText) {
      const result = analyzeSentiment(messageText);
      sentiment = { score: result.score, label: result.label };
    }

    // Determine messageType
    const type = messageType || (fileUrl ? fileType || 'file' : 'text');

    const message = new Message({
      chatID:      chat,
      senderID:    sender,
      text:        messageText,
      fileUrl:     fileUrl   || null,
      fileName:    fileName  || null,
      fileType:    fileType  || null,
      messageType: type,
      sentiment,
    });

    await message.save();

    // Update chat's lastMessage
    await Chat.findByIdAndUpdate(chat, { lastMessage: message._id });

    const populated = await Message.findById(message._id)
      .populate('senderID', 'fullName email username profilePic');

    // Emit via socket for real-time delivery
    const io = req.app.get('io');
    if (io) io.to(String(chat)).emit('receiveMessage', populated);

    return res.status(201).json(populated);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

export default router;