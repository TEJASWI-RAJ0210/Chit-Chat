import React from "react";
const MessageBubble=({message})=>{
   const isMe = message.sender === "me";
   return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2` }>
        <div className ={`max-w-xs px-4 py-2 rounded-lg text-sm ${isMe ? "bg-bubbleMe" : "bg-bubbleOther"}`}>
            {message.text}
        </div>
    </div>
   ) 

}
export default MessageBubble;