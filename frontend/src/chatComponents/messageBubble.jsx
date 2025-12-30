import React from "react";
//import {analyzeSentiment} from "message.route.js";



const MessageBubble = ({ message, myUserId }) => {
  const senderId =
  message.senderID?._id || message.senderID || message.senderId;

  const sentimentLabel = message.sentiment?.label || "neutral";


  const sentimentColour = {
    positive: "bg-green-200",
    negative: "bg-red-200",
    neutral: "bg-gray-200",
  }


  const isMe =
    myUserId &&
    senderId &&
    String(senderId) === String(myUserId);

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs  px-4 py-2 rounded-lg text-sm 
          ${isMe ? "bg-bubbleMe text-black" : "bg-bubbleOther"} ${sentimentColour[sentimentLabel]} `}
      >
        {message.text}
        
      </div>
    </div>
  );
};

export default MessageBubble;
