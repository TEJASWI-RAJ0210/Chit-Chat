<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Video, Phone, MoreVertical, Search } from 'lucide-react';
import socket from '../socket/socket.js';

const getAvatar = (user) =>
  user?.profilePic ||
  `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?._id || 'default'}`;

const ChatHeader = ({ chat, myUserId }) => {
  const [onlineUsers, setOnline] = useState([]);
  const otherUser = chat?.participants?.find((u) => u._id !== myUserId);
  const isOnline  = onlineUsers.includes(otherUser?._id);

  useEffect(() => {
    const fn = (list) => setOnline(list);
    socket.on('online-users', fn);
    return () => socket.off('online-users', fn);
  }, []);

  return (
    <div className="shrink-0 flex items-center gap-3 px-5 py-3.5
                    bg-white border-b border-gray-100 shadow-sm">
      {/* Avatar */}
      <div className="relative">
        <img
          src={getAvatar(otherUser)}
          alt={otherUser?.fullName || 'User'}
          className="w-10 h-10 rounded-2xl object-cover"
        />
        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full
                          border-2 border-white
                          ${isOnline ? 'bg-[#00e5a0]' : 'bg-gray-300'}`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate font-['Syne',sans-serif]">
          {otherUser?.fullName || otherUser?.username || 'Unknown'}
        </p>
        <p className={`text-xs font-medium ${isOnline ? 'text-[#00b87a]' : 'text-gray-400'}`}>
          {isOnline ? '● Online' : '○ Offline'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {[Search, Phone, Video, MoreVertical].map((Icon, i) => (
          <button
            key={i}
            className="w-9 h-9 rounded-xl flex items-center justify-center
                       text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Icon size={17} />
          </button>
        ))}
=======
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

>>>>>>> c87fe41b76793837656014758f2e52d615d56cca
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ChatHeader;
=======
export default ChatHeader;
>>>>>>> c87fe41b76793837656014758f2e52d615d56cca
