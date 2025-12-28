import React from "react";
import MessageBubble from "./messageBubble.jsx";

const MessageList = ({ messages, myUserId }) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          myUserId={myUserId}
        />
      ))}
    </div>
  );
};

export default MessageList;
