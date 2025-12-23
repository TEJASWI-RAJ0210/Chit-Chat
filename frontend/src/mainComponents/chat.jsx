import React from "react";
import Navbar from "../chatComponents/navbar.jsx";
import ChatList from "../chatComponents/chatList.jsx";
import ChatHeader from "../chatComponents/chatHeader.jsx";
import MessageList from "../chatComponents/messageList.jsx";
import MessageBubble from "../chatComponents/messageBubble.jsx";
import MessageInput from "../chatComponents/messageInput.jsx";
import ChatListItem from "../chatComponents/chatListItem.jsx";
import SearchFriend from "../chatComponents/searchFriend.jsx";
import { useEffect } from "react";
import socket from "../socket/socket";

useEffect(() => {
  socket.emit("joinChat", chatID);

  socket.on("receiveMessage", (msg) => {
    console.log(msg);
  });

  return () => socket.off("receiveMessage");
}, [chatID]);

const Chat = () => {
  return (
   
    <div>
      <Navbar />
      <ChatList />  
      <ChatHeader />    
      <MessageBubble />
      <MessageInput />  
      <MessageList />   
        <ChatListItem />
        <SearchFriend />    
      <h1 className="text-3xl font-bold bg-blue-500 text-white p-4 rounded-lg">
        Chat Component
      </h1>
    </div>
  );
};

export default Chat;