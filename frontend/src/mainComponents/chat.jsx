import React, { useState, useEffect } from "react";
import ChatHeader from "../chatComponents/chatHeader.jsx";
import MessageList from "../chatComponents/messageList.jsx";
import MessageInput from "../chatComponents/messageInput.jsx";
import ChatList from "../chatComponents/chatList.jsx";
import Sidebar from "../chatComponents/sidebar.jsx";
import SearchFriend from "../chatComponents/searchFriend.jsx";
import bg from "../assets/chat_bg.jpeg";

const Chat = () => {
  const [chats, setChats] = useState([
    { id: 1, name: "Alice", lastMessage: "Hey, are you there?" },
    { id: 2, name: "Bob", lastMessage: "Let's meet tomorrow." },
  ]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    // only auto-select default chat when search panel is NOT open
    if (!activeChat && chats.length > 0 && !showSearch) {
      setActiveChat(chats[0]);
    }
  }, [chats, activeChat, showSearch]);

  useEffect(() => {
    if (activeChat) {
      setMessages([
        { id: 1, sender: activeChat.name, text: activeChat.lastMessage },
        { id: 2, sender: "me", text: "OK, sounds good." },
      ]);
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        {/* when opening search, also clear activeChat so only sidebar + SearchFriend show */}
        <Sidebar onOpenSearch={() => { setShowSearch(true); setActiveChat(null); }} />

        {showSearch ? (
          <SearchFriend />
        ) : (
          <ChatList
            chats={chats}
            onSelectChat={(c) => {
              setActiveChat(c);
              setShowSearch(false);
            }}
          />
        )}

        {/* message area only shows when a chat is active and search is not open */}
        {!showSearch && activeChat && (
          <div className="flex flex-col flex-1 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
            <ChatHeader chat={activeChat} />
            <MessageList messages={messages} />
            <MessageInput />
          </div>
        )}
      </div>
    </div>
  );
};
export default Chat;
