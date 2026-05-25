import React, { useEffect, useRef } from 'react';
import MessageBubble from './messageBubble.jsx';

// Group messages by date for date separators
const getDateLabel = (dateStr) => {
  if (!dateStr) return null;
  const d   = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
};

const MessageList = ({ messages, myUserId }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Build list with date separators
  const items = [];
  let lastLabel = null;

  messages.forEach((msg) => {
    const label = getDateLabel(msg.createdAt);
    if (label && label !== lastLabel) {
      items.push({ type: 'separator', label, key: `sep-${label}` });
      lastLabel = label;
    }
    items.push({ type: 'message', msg, key: msg._id || Math.random() });
  });

  return (
    <div className="flex-1 overflow-y-auto min-h-0 px-6 py-5 space-y-1
                    bg-[#f7f8fc]">

      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
          <div className="w-14 h-14 rounded-3xl bg-white shadow-sm flex items-center
                          justify-center text-2xl">
            💬
          </div>
          <p className="text-sm font-medium text-gray-500">No messages yet</p>
          <p className="text-xs text-gray-400">Say something to get the conversation started!</p>
        </div>
      )}

      {items.map((item) => {
        if (item.type === 'separator') {
          return (
            <div key={item.key} className="flex items-center gap-3 py-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider
                               bg-[#f7f8fc] px-2">
                {item.label}
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          );
        }
        return (
          <MessageBubble
            key={item.key}
            message={item.msg}
            myUserId={myUserId}
          />
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
