import React from "react";
import { Video,Phone,EllipsisVertical}  from "lucide-react";
import { useEffect, useState } from "react";



const ChatHeader = ({ chat, myUserId }) => {
  const [user, setUser] = useState(null);
  const otherUser = chat?.participants?.find((u) => u._id !== myUserId);

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-[#FFFFFF] text-white">
      <img
        src={otherUser?.profilePic || `https://i.pravatar.cc/40?u=${chat?.id || "anon"}`}
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1 ">
        <div className="font-semibold text-[#393C43] font-Zen Kaku Gothic Antique">{otherUser?.fullName || "Unknown"}</div>
         <div className="text-sm text-[#393C43]">Online</div>
      </div>
      <div className="flex items-center gap-4">
         <Video className="text-[#393C43]" />
         <Phone className="text-[#393C43]" />
         <EllipsisVertical className="text-[#393C43]" />

      </div>
    </div>
  );
};

export default ChatHeader;
