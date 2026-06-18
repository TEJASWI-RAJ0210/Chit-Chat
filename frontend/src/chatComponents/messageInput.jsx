import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, X, FileText, Image, Film } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { sendMessage } from '../API.js';
import api from '../API.js';
import socket from '../socket/socket.js';

// ── File type helpers ──────────────────────────────────────────────
const getMessageType = (file) => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return 'file';
};

const FilePreview = ({ file, onRemove }) => {
  const type = getMessageType(file);
  const url  = URL.createObjectURL(file);
  const size  = file.size > 1024 * 1024
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : `${(file.size / 1024).toFixed(0)} KB`;

  return (
    <div className="flex items-center gap-3 mx-5 mt-3 p-3 bg-gray-50
                    border border-gray-200 rounded-2xl">
      {/* Thumbnail or icon */}
      {type === 'image' ? (
        <img src={url} alt="preview"
             className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-200" />
      ) : type === 'video' ? (
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center
                        justify-center shrink-0">
          <Film size={16} className="text-purple-500" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center
                        justify-center shrink-0">
          <FileText size={16} className="text-blue-400" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{size}</p>
      </div>

      <button onClick={onRemove}
              className="w-6 h-6 rounded-lg bg-gray-200 hover:bg-red-100
                         hover:text-red-500 flex items-center justify-center
                         text-gray-400 transition-colors shrink-0">
        <X size={12} />
      </button>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────
const MessageInput = ({ chatId, overrideOnSend }) => {
  const [message,    setMessage]    = useState('');
  const [sending,    setSending]    = useState(false);
  const [showEmoji,  setShowEmoji]  = useState(false);
  const [file,       setFile]       = useState(null);   // selected File object
  const [uploadPct,  setUploadPct]  = useState(0);       // 0-100 upload progress
  const [uploading,  setUploading]  = useState(false);

  const pickerRef  = useRef(null);
  const inputRef   = useRef(null);
  const fileRef    = useRef(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const fn = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target))
        setShowEmoji(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const onEmojiClick = (emojiData) => {
    const input = inputRef.current;
    const emoji = emojiData.emoji;
    if (input) {
      const start  = input.selectionStart;
      const end    = input.selectionEnd;
      const newVal = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newVal);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setMessage((p) => p + emoji);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // 20 MB max
    if (selected.size > 20 * 1024 * 1024) {
      alert('File is too large. Maximum size is 20 MB.');
      return;
    }
    setFile(selected);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const uploadFile = async (fileToUpload) => {
    const formData = new FormData();
    formData.append('file', fileToUpload);

    setUploading(true);
    setUploadPct(0);

    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        setUploadPct(Math.round((e.loaded * 100) / e.total));
      },
    });
    // notify server/room in real-time so other clients (and this client if needed) get the message
    socket.emit('sendMessage', {
      chatID: chatId,
      senderID: localStorage.getItem('userId'),
      text: message,
    });

    setUploading(false);
    return res.data; // { url, resourceType, format, ... }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const hasText = message.trim().length > 0;
    const hasFile = !!file;
    if ((!hasText && !hasFile) || sending) return;

    setShowEmoji(false);
    setSending(true);

    try {
      if (typeof overrideOnSend === 'function') {
        // AI chat — text only
        await overrideOnSend(message);
      } else if (hasFile) {
        // 1. Upload file to Cloudinary
        const uploaded = await uploadFile(file);

        // 2. Send message with fileUrl
        await api.post('/messages', {
          chatID:      chatId,
          senderID:    localStorage.getItem('userId'),
          text:        message || '',            // optional caption
          fileUrl:     uploaded.url,
          fileName:    file.name,
          fileType:    uploaded.resourceType,    // image / video / raw
          messageType: getMessageType(file),
        });

        setFile(null);
      } else {
        // Plain text message
        await sendMessage(chatId, message);
        // notify server/room in real-time so other clients (and this client if needed) get the message
       socket.emit('sendMessage', {
         chatID: chatId,
         senderID: localStorage.getItem('userId'),
         text: message,
       });
      }
    } catch (err) {
      console.error('Send failed:', err);
    } finally {
      setMessage('');
      setSending(false);
      setUploadPct(0);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSend(e);
    if (e.key === 'Escape') { setShowEmoji(false); setFile(null); }
  };

  const canSend = (message.trim() || file) && !sending && !uploading;

  return (
    <div className="shrink-0 bg-white border-t border-gray-100">

      {/* File preview strip */}
      {file && (
        <FilePreview file={file} onRemove={() => setFile(null)} />
      )}

      {/* Upload progress bar */}
      {uploading && (
        <div className="mx-5 mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00e5a0] rounded-full transition-all duration-200"
            style={{ width: `${uploadPct}%` }}
          />
        </div>
      )}

      {/* Emoji picker */}
      {showEmoji && (
        <div ref={pickerRef}
             className="absolute bottom-[72px] right-5 z-50 shadow-2xl
                        rounded-2xl overflow-hidden">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
            height={380}
            width={320}
            theme="light"
          />
        </div>
      )}

      {/* Input row */}
      <div className="px-5 py-4">
        <div className={`flex items-center gap-2 bg-[#f7f8fc] border rounded-2xl
                          px-4 py-2.5 transition-all
                          ${showEmoji
                            ? 'border-[#00e5a0]/60 ring-2 ring-[#00e5a0]/10'
                            : 'border-gray-200 focus-within:border-[#00e5a0]/60 focus-within:ring-2 focus-within:ring-[#00e5a0]/10'
                          }`}>

          {/* Paperclip — opens file picker */}
          <button type="button"
                  onClick={() => fileRef.current.click()}
                  className={`transition-colors shrink-0
                              ${file
                                ? 'text-[#00b87a]'
                                : 'text-gray-400 hover:text-gray-600'}`}
                  title="Attach file">
            <Paperclip size={17} />
          </button>

          {/* Hidden file input */}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
            onChange={handleFileChange}
          />

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={file ? 'Add a caption (optional)…' : 'Write a message…'}
            className="flex-1 bg-transparent text-sm text-gray-700
                       placeholder-gray-400 outline-none min-w-0"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Emoji */}
          <button type="button"
                  onClick={() => setShowEmoji((p) => !p)}
                  className={`transition-colors shrink-0
                              ${showEmoji
                                ? 'text-[#00b87a]'
                                : 'text-gray-400 hover:text-gray-600'}`}>
            <Smile size={17} />
          </button>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`w-8 h-8 rounded-xl flex items-center justify-center
                        shrink-0 transition-all duration-150
                        ${canSend
                          ? 'bg-[#0f1117] text-white hover:bg-[#00e5a0] hover:text-[#0f1117] shadow-sm'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {uploading
              ? <span className="text-[9px] font-bold">{uploadPct}%</span>
              : <Send size={14} />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;