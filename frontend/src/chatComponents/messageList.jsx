import React from "react";
import MessageBubble from "./messageBubble.jsx";
const MessageList=({messages})=>{
    return (
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
            ))}
        </div>
    );
}
export default MessageList;