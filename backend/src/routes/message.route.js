import { Router } from 'express';
import Chat    from '../models/chat.model.js';
import Message from '../models/message.model.js';
import { analyzeSentiment } from '../utils/Sentiment.js';

const router = Router();

// ── Helper: emit an event to every online participant of a chat ──
// ✅ FIX 2: onlineUsers stores a single socketId per user (string),
// not a Set. The old code did `for (const socketId of sockets)` which
// silently iterated individual CHARACTERS of the socket ID string.
const emitToParticipants = async (req, chatId, event, payload) => {
  const io          = req.app.get('io');
  const onlineUsers = req.app.get('onlineUsers'); // Map<userId, socketId>
  if (!io || !onlineUsers) return;

  try {
    const chatDoc = await Chat.findById(chatId).select('participants');
    if (!chatDoc) return;

    for (const participantId of chatDoc.participants) {
      const pid      = String(participantId);
      const socketId = onlineUsers.get(pid); // ✅ single string, not a Set
      if (socketId) {
        io.to(socketId).emit(event, payload);
      }
    }
  } catch (e) {
    console.error(`Direct emit (${event}) failed:`, e.message);
  }
};

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
      const r = analyzeSentiment(messageText);
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

    const io = req.app.get('io');
    if (io) {
      // Room-based emit (works once both users have called joinChat)
      io.to(chat).emit('receiveMessage', populated);
      // Direct emit as a backup — reaches participants even if they
      // haven't joined the room yet (e.g. chat list view)
      await emitToParticipants(req, chat, 'receiveMessage', populated);
    }

    return res.status(201).json(populated);
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
});

// PUT /api/messages/:chatId/seen
router.put('/:chatId/seen', async (req, res) => {
  try {
    const { userId } = req.body;
    const chatId   = String(req.params.chatId);
    const viewerId = String(userId);

    const unseenMessages = await Message.find({
      chatID: chatId,
      senderID: { $ne: viewerId },
      isSeen: false,
    });

    if (unseenMessages.length === 0) {
      return res.json({ success: true, updated: 0 });
    }

    const seenMessageIds = unseenMessages.map((m) => m._id);

    await Message.updateMany(
      { _id: { $in: seenMessageIds } },
      { isSeen: true, seenAt: new Date() }
    );

    const io = req.app.get('io');
    const payload = {
      chatId,
      messageIds: seenMessageIds.map((id) => String(id)),
    };

    if (io) {
      io.to(chatId).emit('messages-seen', payload);
      await emitToParticipants(req, chatId, 'messages-seen', payload);
    }

    res.json({ success: true, updated: seenMessageIds.length });
  } catch (err) {
    console.error('Mark seen error:', err);
    res.status(500).json({ message: 'Error marking messages as seen', error: err.message });
  }
});

export default router;