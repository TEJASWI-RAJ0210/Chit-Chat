import React from "react";


const MessageBubble = ({ message, myUserId }) => {
  const senderId =
  message.senderID?._id || message.senderID || message.senderId;


  const isMe =
    myUserId &&
    senderId &&
    String(senderId) === String(myUserId);

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs bg-white  px-4 py-2 rounded-lg text-sm 
          ${isMe ? "bg-bubbleMe text-black" : "bg-bubbleOther"}`}
      >
        {message.text}
        
      </div>
    </div>
  );
};

export default MessageBubble;
