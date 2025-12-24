import React from "react";
import { useState,} from "react";
import ChatList from "../chatComponents/chatList.jsx";
import ChatHeader from "../chatComponents/chatHeader.jsx";
import MessageList from "../chatComponents/messageList.jsx";
import MessageBubble from "../chatComponents/messageBubble.jsx";
import MessageInput from "../chatComponents/messageInput.jsx";
import SearchFriend from "../chatComponents/searchFriend.jsx";
const Chat = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
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