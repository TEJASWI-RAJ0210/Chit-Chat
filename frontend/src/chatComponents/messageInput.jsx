import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { sendMessage } from '../API.js';

const MessageInput = ({ chatId, overrideOnSend }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending]  = useState(false);
  const inputRef = useRef();

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!message.trim() || sending) return;

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
  };

  return (
    <div className="shrink-0 px-5 py-4 bg-white border-t border-gray-100">
      <div className="flex items-center gap-2 bg-[#f7f8fc] border border-gray-200
                      rounded-2xl px-4 py-2.5 focus-within:border-[#00e5a0]/60
                      focus-within:ring-2 focus-within:ring-[#00e5a0]/10 transition-all">

        {/* Attachment */}
        <button type="button"
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
          <Paperclip size={17} />
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Write a message…"
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400
                     outline-none min-w-0"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Emoji */}
        <button type="button"
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
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