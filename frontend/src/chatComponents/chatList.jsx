import React from "react";

const ChatList = () => {
  return (
    <div className="w-[240px] h-screen bg-cyan-200 border-r border-gray-300 flex flex-col ml-[69px]">
      
      {/* Header */}
      <div className="px-4 py-3 font-[Zen_Kaku_Gothic_Antique] text-sm font-semibold border-b">
        MESSAGES
      </div>

      {/* Search Bar */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Find or start a conversation"
          className="w-[220px] h-[28px] px-3 text-xs font-[Zen_Kaku_Gothic_Antique] bg-white rounded-[9px] outline-none"
        />
      </div>

      {/* Chat List */}
      <div className="flex flex-col gap-2 px-3">
        
        {/* Chat Item */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/60 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40?img=1"
            alt="avatar"
            className="w-9 h-9 rounded-full"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium">
              Tejaswi
            </span>
            <span className="text-xs text-gray-600 truncate">
              Listening to music 🎵
            </span>
          </div>
        </div>

        {/* Chat Item */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40?img=2"
            alt="avatar"
            className="w-9 h-9 rounded-full"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium">
              Phibi
            </span>
            <span className="text-xs text-gray-600 truncate">
              Playing GTA 🎮
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatList;
