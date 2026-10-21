import React, { useState } from 'react';
import { FileText, Film, Download, ZoomIn } from 'lucide-react';

const sentimentStyle = {
  positive: { bubble: 'bg-[#e6faf3] border-[#a8edcc]', label: '😊' },
  negative: { bubble: 'bg-[#fff0f0] border-[#ffc5c5]', label: '😟' },
  neutral:  { bubble: 'bg-white border-gray-200',       label: null  },
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatSize = (bytes) => {
  if (!bytes) return '';
  return bytes > 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;
};

// ── Image with lightbox ────────────────────────────────────────────
const ImageAttachment = ({ url, fileName }) => {
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className="relative group cursor-zoom-in"
           onClick={() => setLightbox(true)}>
        <img
          src={url}
          alt={fileName || 'image'}
          className="max-w-[240px] max-h-[200px] rounded-xl object-cover
                     border border-black/5 shadow-sm"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/10
                        flex items-center justify-center transition-all">
          <ZoomIn size={18} className="text-white opacity-0 group-hover:opacity-100
                                        drop-shadow transition-opacity" />
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50
                     flex items-center justify-center p-6"
          onClick={() => setLightbox(false)}
        >
          <img
            src={url}
            alt={fileName}
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}
    </>
  );
};

// ── Video attachment ───────────────────────────────────────────────
const VideoAttachment = ({ url }) => (
  <video
    src={url}
    controls
    className="max-w-[260px] rounded-xl border border-black/5 shadow-sm"
  />
);

// ── Generic file attachment ────────────────────────────────────────
const FileAttachment = ({ url, fileName, isMe }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    download={fileName}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border
                transition-colors min-w-[180px]
                ${isMe
                  ? 'bg-white/10 border-white/20 hover:bg-white/20'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
    onClick={(e) => e.stopPropagation()}
  >
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                     ${isMe ? 'bg-white/20' : 'bg-blue-50'}`}>
      <FileText size={16} className={isMe ? 'text-white' : 'text-blue-400'} />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-xs font-medium truncate
                     ${isMe ? 'text-white' : 'text-gray-700'}`}>
        {fileName || 'File'}
      </p>
      <p className={`text-[10px] mt-0.5 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
        Download
      </p>
    </div>
    <Download size={13} className={isMe ? 'text-white/60' : 'text-gray-400'} />
  </a>
);

// ── Main bubble ────────────────────────────────────────────────────
const MessageBubble = ({ message, myUserId }) => {
  const senderId = message.senderID?._id || message.senderID || message.senderId;
  const isMe     = myUserId && senderId && String(senderId) === String(myUserId);
  const label    = message.sentiment?.label || 'neutral';
  const style    = sentimentStyle[label] || sentimentStyle.neutral;
  const text     = message.text || message.content || '';
  const time     = formatTime(message.createdAt);
  const type     = message.messageType || 'text';
  const fileUrl  = message.fileUrl;
  const fileName = message.fileName;

  return (
    <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`
        relative max-w-[72%] rounded-2xl border text-sm leading-relaxed shadow-sm
        ${type === 'text' ? 'px-4 py-2.5' : 'p-2'}
        ${isMe
          ? 'bg-[#0f1117] border-transparent text-white rounded-br-md'
          : `${style.bubble} text-gray-800 rounded-bl-md`}
      `}>

        {/* ── Attachment rendering ── */}
        {type === 'image' && fileUrl && (
          <div className="mb-1">
            <ImageAttachment url={fileUrl} fileName={fileName} />
          </div>
        )}

        {type === 'video' && fileUrl && (
          <div className="mb-1">
            <VideoAttachment url={fileUrl} />
          </div>
        )}

        {type === 'file' && fileUrl && (
          <div className="mb-1">
            <FileAttachment url={fileUrl} fileName={fileName} isMe={isMe} />
          </div>
        )}

        {/* Caption or text */}
        {text && (
          <p className={`break-words whitespace-pre-wrap
                         ${type !== 'text' ? 'px-2 pb-1 text-xs' : ''}`}>
            {text}
          </p>
        )}

        {/* Timestamp + sentiment */}
        <div className={`flex items-center gap-1.5 mt-1
                         ${type !== 'text' ? 'px-2 pb-1' : ''}
                         ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[10px] text-gray-400">{time}</span>

          {!isMe && label !== 'neutral' && (
            <span className="text-[11px]" title={`Sentiment: ${label}`}>
              {style.label}
            </span>
          )}

          {isMe && (
             <span className="text-[10px] text-gray-500">
                 {message.isSeen ? "✓✓ Seen" : "✓ Sent"}
             </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;