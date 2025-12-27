import React, { useState, useEffect, use } from "react";
import ChatHeader from "../chatComponents/chatHeader.jsx";
import MessageList from "../chatComponents/messageList.jsx";
import MessageInput from "../chatComponents/messageInput.jsx";
import ChatList from "../chatComponents/chatList.jsx";
import Sidebar from "../chatComponents/sidebar.jsx";
import SearchFriend from "../chatComponents/searchFriend.jsx";
import bg from "../assets/chat_bg.jpeg";
import api from "../API.js";

const Chat = () => {
  const myUserId = localStorage.getItem("userId");

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  /* ---------------- FETCH CHATS ---------------- */
  useEffect(() => {
    if (!myUserId) return;

    const fetchChats = async () => {
      try {
        const res = await api.get(`/chat/${myUserId}`);
        setChats(res.data);

        // auto select first chat
        if (res.data.length > 0) {
          setActiveChat(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };

    fetchChats();
  }, [myUserId]);

  /* ---------------- FETCH MESSAGES ---------------- */
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${activeChat._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();
  }, [activeChat]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">

        {/* Sidebar */}
        <Sidebar
          onOpenSearch={() => {
            setShowSearch(true);
            setActiveChat(null);
          }}
        />

        {/* Left Panel */}
        {showSearch ? (
          <SearchFriend />
        ) : (
          <ChatList
            onSelectChat={(chat) => {
              setActiveChat(chat);
              setShowSearch(false);
            }}
          />
        )}

        {/* Chat Window */}
        {!showSearch && activeChat && (
          <div
            className="flex flex-col flex-1 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg}) `}}
          >
            <ChatHeader chat={activeChat} myUserId={myUserId} />
            <MessageList messages={messages} />
            <MessageInput chatId={activeChat._id} />
          </div>
        )}
      </div>
    </div>
  );
};
export default Chat;