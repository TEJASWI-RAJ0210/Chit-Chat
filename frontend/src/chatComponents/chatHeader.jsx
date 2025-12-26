import React from "react";

const ChatHeader = ({ chat }) => {
  return (
    <div className="flex items-center gap-3 p-4 border-b bg-gray-700 text-white">
      <img
        src={chat?.avatar || `https://i.pravatar.cc/40?u=${chat?.id || "anon"}`}
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="font-semibold">{chat?.name || "Unknown"}</div>
        {chat?.lastMessage && (
          <div className="text-xs text-gray-300 truncate">{chat.lastMessage}</div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
