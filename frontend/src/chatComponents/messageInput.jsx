
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { sendMessage } from '../API.js';

const MessageInput = ({ chatId, overrideOnSend }) => {
  const [message, setMessage]         = useState('');
  const [sending, setSending]         = useState(false);
  const [showEmoji, setShowEmoji]     = useState(false);
  const pickerRef                     = useRef(null);
  const inputRef                      = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Insert emoji at cursor position
  const onEmojiClick = (emojiData) => {
    const input    = inputRef.current;
    const emoji    = emojiData.emoji;

    if (input) {
      const start  = input.selectionStart;
      const end    = input.selectionEnd;
      const newVal = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newVal);

      // Restore cursor after emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setMessage((prev) => prev + emoji);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!message.trim() || sending) return;
    setShowEmoji(false);
    setSending(true);
    try {
      if (typeof overrideOnSend === 'function') {
        await overrideOnSend(message);
      } else {
        await sendMessage(chatId, message);
      }
    } catch (err) {
      console.error('Send failed:', err);
    } finally {
      setMessage('');
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSend(e);
    if (e.key === 'Escape') setShowEmoji(false);
  };

  return (
    <div className="shrink-0 px-5 py-4 bg-white border-t border-gray-100 relative">

      {/* Emoji Picker — floats above input */}
      {showEmoji && (
        <div
          ref={pickerRef}
          className="absolute bottom-[72px] right-5 z-50 shadow-2xl rounded-2xl overflow-hidden"
        >
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            skinTonesDisabled
            searchDisabled={false}
            previewConfig={{ showPreview: false }}
            height={380}
            width={320}
            theme="light"
          />
        </div>
      )}

      <div className={`flex items-center gap-2 bg-[#f7f8fc] border rounded-2xl px-4 py-2.5
                        transition-all
                        ${showEmoji
                          ? 'border-[#00e5a0]/60 ring-2 ring-[#00e5a0]/10'
                          : 'border-gray-200 focus-within:border-[#00e5a0]/60 focus-within:ring-2 focus-within:ring-[#00e5a0]/10'
                        }`}>

        {/* Attachment */}
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        >
          <Paperclip size={17} />
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Write a message…"
          className="flex-1 bg-transparent text-sm text-gray-700
                     placeholder-gray-400 outline-none min-w-0"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Emoji toggle */}
        <button
          type="button"
          onClick={() => setShowEmoji((p) => !p)}
          className={`transition-colors shrink-0 ${
            showEmoji ? 'text-[#00b87a]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Smile size={17} />
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || sending}
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0
                      transition-all duration-150
                      ${message.trim()
                        ? 'bg-[#0f1117] text-white hover:bg-[#00e5a0] hover:text-[#0f1117] shadow-sm'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;