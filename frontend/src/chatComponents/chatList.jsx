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
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
