import React from "react";
const MessageBubble = ({ message, myUserId }) => {
    // Support different field names from server/client
    const senderId = message.senderId || message.senderID || message.sender;
    const text = message.text || message.content || message.message || "";
    const isMe = Boolean(myUserId && senderId && String(senderId) === String(myUserId)) || message.sender === "me";

    return (
        <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${isMe ? "bg-bubbleMe" : "bg-bubbleOther"}`}>
                {text}
            </div>
        </div>
    );
};

export default MessageBubble;