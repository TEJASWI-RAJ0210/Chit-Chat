import React from "react";
import Navbar from "../chatComponents/navbar.jsx";
import ChatList from "../chatComponents/chatList.jsx";
import ChatHeader from "../chatComponents/chatHeader.jsx";
import MessageList from "../chatComponents/messageList.jsx";
import MessageBubble from "../chatComponents/messageBubble.jsx";
import MessageInput from "../chatComponents/messageInput.jsx";
import ChatListItem from "../chatComponents/chatListItem.jsx";
import SearchFriend from "../chatComponents/searchFriend.jsx";
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