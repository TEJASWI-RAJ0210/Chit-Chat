

import React from "react";
import ChatList from "../chatComponents/chatList.jsx";
import ChatHeader from "../chatComponents/chatHeader.jsx";
import MessageList from "../chatComponents/messageList.jsx";
import MessageBubble from "../chatComponents/messageBubble.jsx";
import MessageInput from "../chatComponents/messageInput.jsx";
import SearchFriend from "../chatComponents/searchFriend.jsx";
import ChatAi from "../chatComponents/chatAi.jsx";
const Chat = () => {
  return (
   
    <div>
      <ChatList />  
      <ChatHeader />    
      <MessageBubble />
      <MessageInput />  
      <MessageList />   
      <ChatAi />
        <SearchFriend />    
      <h1 className="text-3xl font-bold bg-blue-500 text-white p-4 rounded-lg">
        Chat Component
      </h1>
    </div>
  );
};
export default Chat;