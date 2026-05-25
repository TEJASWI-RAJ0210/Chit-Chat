import React from 'react';

const sentimentStyle = {
  positive: { bubble: 'bg-[#e6faf3] border-[#a8edcc]',    dot: 'bg-[#00b87a]', label: '😊' },
  negative: { bubble: 'bg-[#fff0f0] border-[#ffc5c5]',    dot: 'bg-red-400',   label: '😟' },
  neutral:  { bubble: 'bg-white     border-gray-200',      dot: 'bg-gray-300',  label: null  },
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

      {/* Bubble */}
      <div
        className={`
          relative max-w-[72%] px-4 py-2.5 rounded-2xl border text-sm
          leading-relaxed shadow-sm
          ${isMe
            ? 'bg-[#0f1117] border-transparent text-white rounded-br-md'
            : `${style.bubble} border text-gray-800 rounded-bl-md`}
        `}
      >
        {/* Message text */}
        <p className="break-words">{text}</p>

        {/* Time + sentiment */}
        <div className={`flex items-center gap-1.5 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
            {time}
          </span>

          {/* Sentiment dot (only on received messages) */}
          {!isMe && label !== 'neutral' && (
            <span className="text-[10px]">{style.label}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;