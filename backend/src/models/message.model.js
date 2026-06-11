// src/models/message.model.js
// Changes from original:
// 1. text is no longer required (file messages may have no text)
// 2. Added fileUrl, fileName, fileType, messageType fields

import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema(
  {
    chatID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Chat',
    },
    senderID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // ✅ No longer required — file messages may send fileUrl with no text
    text: {
      type: String,
      trim: true,
      default: '',
    },
    // ✅ New fields for attachments
    fileUrl: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    fileType: {
      // 'image' | 'video' | 'raw' (pdf, doc, etc.)
      type: String,
      default: null,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'video', 'file'],
      default: 'text',
    },
    sentiment: {
      score: { type: Number, default: 0 },
      label: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
        default: 'neutral',
      },
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;