import React, { useState, useEffect } from "react";
import ChatHeader from "../chatComponents/chatHeader.jsx";
import MessageList from "../chatComponents/messageList.jsx";
import MessageInput from "../chatComponents/messageInput.jsx";
import ChatList from "../chatComponents/chatList.jsx";

const Chat = () => {
  const [chats, setChats] = useState([
    { id: 1, name: "Alice", lastMessage: "Hey, are you there?" },
    { id: 2, name: "Bob", lastMessage: "Let's meet tomorrow." },
  ]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!activeChat && chats.length > 0) {
      setActiveChat(chats[0]);
    }
  }, [chats, activeChat]);

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
        <ChatList chats={chats} onSelectChat={setActiveChat} />
        {activeChat && (
          <div className="flex flex-col flex-1 bg-gray-600">
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
