import React from 'react';

const sentimentStyle = {
  positive: { bubble: 'bg-[#e6faf3] border-[#a8edcc]', label: '😊' },
  negative: { bubble: 'bg-[#fff0f0] border-[#ffc5c5]', label: '😟' },
  neutral:  { bubble: 'bg-white border-gray-200',       label: null  },
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageBubble = ({ message, myUserId }) => {
  const senderId = message.senderID?._id || message.senderID || message.senderId;
  const isMe     = myUserId && senderId && String(senderId) === String(myUserId);
  const label    = message.sentiment?.label || 'neutral';
  const style    = sentimentStyle[label] || sentimentStyle.neutral;
  const text     = message.text || message.content || '';
  const time     = formatTime(message.createdAt);

  return (
    <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`
        relative max-w-[72%] px-4 py-2.5 rounded-2xl border text-sm leading-relaxed shadow-sm
        ${isMe
          ? 'bg-[#0f1117] border-transparent text-white rounded-br-md'
          : `${style.bubble} text-gray-800 rounded-bl-md`}
      `}>

        {/* Message text — supports emoji rendering natively */}
        <p className="break-words whitespace-pre-wrap">{text}</p>

        {/* Timestamp + sentiment */}
        <div className={`flex items-center gap-1.5 mt-1
                         ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[10px] text-gray-400">{time}</span>

          {/* ✅ Show sentiment emoji on received messages when not neutral */}
          {!isMe && label !== 'neutral' && (
            <span
              className="text-[11px]"
              title={`Sentiment: ${label}`}
            >
              {style.label}
            </span>
          )}

          {/* ✅ Show subtle read tick on sent messages */}
          {isMe && (
            <span className="text-[10px] text-gray-500">✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;