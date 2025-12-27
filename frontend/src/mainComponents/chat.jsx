import React, { useState, useEffect } from "react";
import ChatHeader from "../chatComponents/chatHeader.jsx";
import MessageList from "../chatComponents/messageList.jsx";
import MessageInput from "../chatComponents/messageInput.jsx";
import ChatList from "../chatComponents/chatList.jsx";
import Sidebar from "../chatComponents/sidebar.jsx";
import SearchFriend from "../chatComponents/searchFriend.jsx";
import bg from "../assets/chat_bg.jpeg";
import socket from "../socket/socket.js";

const Chat = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      // Accept several possible field names from server/client
      const senderId = message.senderId || message.senderID || message.sender;
      const receiverId = message.receiverId || message.receiverID || message.receiver;

      if (senderId === activeChat?._id || receiverId === activeChat?._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [activeChat]);

  const handleSendMessage = (text) => {
    if (!text.trim() || !activeChat) return;

    const messageData = {
      chatID: activeChat._id,
      senderID: currentUser._id,
      receiverId: activeChat._id,
      text,
      createdAt: new Date(),
    };

    // Join the chat room (so server emits to the right room)
    socket.emit("joinChat", activeChat._id);

    // Emit fields expected by backend socket handler
    socket.emit("sendMessage", {
      chatID: messageData.chatID,
      senderID: messageData.senderID,
      text: messageData.text,
    });

    // Optimistically append message locally
    setMessages((prev) => [...prev, messageData]);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          onOpenSearch={() => {
            setShowSearch(true);
            setActiveChat(null);
          }}
        />

        {showSearch ? (
          <SearchFriend />
        ) : (
          <ChatList
            chats={chats}
            onSelectChat={(chat) => {
              setActiveChat(chat);
              setShowSearch(false);
              setMessages([]); // optional: reset messages on chat switch
            }}
          />
        )}

        {!showSearch && (
          (activeChat && (
            <div
              className="flex flex-col flex-1 bg-cover bg-center"
              style={{ backgroundImage: `url(${bg})` }}
            >
              <ChatHeader chat={activeChat} myUserId={currentUser?._id} />
              <MessageList messages={messages} myUserId={currentUser?._id} />
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          )) || (
            <div className="flex-1 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
              <div className="bg-white/80 p-6 rounded-md text-center">
                <h2 className="text-lg font-semibold mb-2">No conversation selected</h2>
                <p className="text-sm text-gray-600">Select a chat from the left or start a new conversation.</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Chat;
