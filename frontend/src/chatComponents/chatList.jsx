import React from "react";
import bg from "../assets/chatList_bg.jpeg";

const ChatList = ({ chats = [], onSelectChat }) => {
  const items =
    chats.length > 0
      ? chats
      : [
          { id: 1, name: "Tejaswi", lastMessage: "Listening to music 🎵" },
          { id: 2, name: "Phibi", lastMessage: "Playing GTA 🎮" },
        ];

  return (
    <div className="w-[240px] h-screen bg-cover bg-center border-r border-gray-300 flex flex-col" style={{ backgroundImage: `url(${bg})` }}  >
      <div className="px-4 py-3 font-[Zen_Kaku_Gothic_Antique] text-sm font-semibold border-b">
        MESSAGES
      </div>

      <div className="p-3">
        <input
          type="text"
          placeholder="Find or start a conversation"
          className="w-[220px] h-[28px] px-3 text-xs font-[Zen_Kaku_Gothic_Antique] bg-white  outline-none"
        />
      </div>

      <div className="flex flex-col gap-2 px-3">
        {items.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectChat && onSelectChat(c)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 cursor-pointer"
          >
            <img
              src={c.avatar || `https://i.pravatar.cc/40?u=${c.id}`}
              alt="avatar"
              className="w-9 h-9 rounded-full"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium">{c.name}</span>
              <span className="text-xs text-gray-600 truncate">Listening to music 🎵</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
