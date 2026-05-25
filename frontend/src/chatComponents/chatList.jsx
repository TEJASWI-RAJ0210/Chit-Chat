<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { getChats } from '../API.js';
import socket from '../socket/socket.js';
import { FiSearch, FiEdit } from 'react-icons/fi';

const getAvatar = (user) =>
  user?.profilePic ||
  `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?._id || 'default'}`;

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ChatList = ({ onSelectChat, activeChatId }) => {
  const [chats, setChats]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [onlineUsers, setOnline]  = useState([]);
  const [search, setSearch]       = useState('');
  const loggedInUserId            = localStorage.getItem('userId');

  useEffect(() => {
    if (!loggedInUserId) return;
    getChats(loggedInUserId)
      .then((res) => setChats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [loggedInUserId]);

  useEffect(() => {
    const fn = (list) => setOnline(list);
    socket.on('online-users', fn);
    return () => socket.off('online-users', fn);
  }, []);

  const filtered = chats.filter((chat) => {
    const friend = chat.participants.find((p) => p._id !== loggedInUserId);
    const name = (friend?.fullName || friend?.username || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="w-[280px] h-full bg-[#15181f] border-r border-white/[0.06]
                    flex flex-col overflow-hidden shrink-0">

      {/* Header */}
      <div className="px-5 pt-6 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-['Syne',sans-serif] font-semibold text-lg tracking-tight">
            Messages
          </h2>
          <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center
                             justify-center text-gray-400 hover:text-white transition-colors">
            <FiEdit size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
          <FiSearch size={13} className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search conversations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-gray-600 outline-none flex-1"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {loading && (
          <div className="flex flex-col gap-2 px-3 mt-2">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-white/5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-2 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-xs text-gray-600 text-center mt-8">No conversations found</p>
        )}

        {filtered.map((chat) => {
          const friend  = chat.participants.find((p) => p._id !== loggedInUserId);
          if (!friend) return null;

          const isOnline = onlineUsers.includes(friend._id);
          const isActive = chat._id === activeChatId;
          const lastMsg  = chat.lastMessage?.content || 'No messages yet';
          const lastTime = formatTime(chat.lastMessage?.createdAt || chat.updatedAt);

          return (
            <button
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left
                          transition-all duration-150 group
                          ${isActive
                            ? 'bg-[#00e5a0]/10 border border-[#00e5a0]/20'
                            : 'hover:bg-white/5 border border-transparent'}`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={getAvatar(friend)}
                  alt={friend.fullName}
                  className="w-10 h-10 rounded-2xl object-cover"
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full
                                  border-2 border-[#15181f]
                                  ${isOnline ? 'bg-[#00e5a0]' : 'bg-gray-600'}`} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-sm font-medium truncate
                                    ${isActive ? 'text-white' : 'text-gray-200'}`}>
                    {friend.fullName || friend.username}
                  </span>
                  <span className="text-[10px] text-gray-600 shrink-0">{lastTime}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{lastMsg}</p>
              </div>
            </button>
=======
import React, { useEffect, useState } from "react";
import bg from "../assets/chatList_bg.jpeg";
import { getChats } from "../API.js";

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!loggedInUserId) return;

    const fetchChats = async () => {
      try {
        const res = await getChats(loggedInUserId); // ✅ PASS ID
        setChats(res.data);
      } catch (err) {
        console.error("Failed to fetch chats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [loggedInUserId]);

  return (
    <div
      className="w-[240px] h-screen bg-cover bg-center border-r border-gray-300 flex flex-col"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="px-4 py-3 text-sm font-semibold border-b">
        MESSAGES
      </div>

      <div className="p-3">
        <input
          type="text"
          placeholder="Find or start a conversation"
          className="w-[220px] h-[28px] px-3 text-xs bg-white outline-none"
        />
      </div>

      <div className="flex flex-col gap-2 px-3 overflow-y-auto">
        {loading && (
          <p className="text-xs text-gray-500 text-center">
            Loading chats...
          </p>
        )}

        {!loading && chats.length === 0 && (
          <p className="text-xs text-gray-500 text-center">
            No chats yet
          </p>
        )}

        {chats.map((chat) => {
          const friend = chat.participants.find(
            (p) => p._id !== loggedInUserId
          );
          if (!friend) return null;

          return (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer flex items-center gap-3"
            >
              <img
                src={
                  friend.profilePic ||
                  `https://i.pravatar.cc/40?u=${friend._id}`
                }
                alt="avatar"
                className="w-9 h-9 rounded-full"
              />

              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium">
                  {friend.fullName || friend.username}
                </span>
                <span className="text-xs text-gray-600 truncate">
                  {chat.messages?.[0]?.content || "No messages yet"}
                </span>
              </div>
            </div>
>>>>>>> c87fe41b76793837656014758f2e52d615d56cca
          );
        })}
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ChatList;
=======
export default ChatList;
>>>>>>> c87fe41b76793837656014758f2e52d615d56cca
