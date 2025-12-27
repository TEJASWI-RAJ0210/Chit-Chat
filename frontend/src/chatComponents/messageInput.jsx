import React, { useState } from "react";
import { SendHorizontal, SmilePlus, Paperclip } from "lucide-react";
import socket from "../socket/socket";
import { sendMessage } from "../API.js";

const MessageInput = ({ onSendMessage ,chatId}) => {
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend =async (e) => {
    e.preventDefault();

    if (!message.trim()) return;
    const res= await sendMessage(chatId, message);
    socket.emit("send-message", res.data);

    onSendMessage(message); 
    setMessage("");
  };

  return (
    <div className="w-full p-3 border-t">
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 rounded-lg border border-black bg-white px-3 py-2 shadow-md"
      >
        <input
          type="text"
          placeholder="Type a new message here"
          className="flex-grow outline-none"
          value={message}
          onChange={handleInputChange}
        />

        <button type="button" className="text-gray-600 hover:text-black">
          <Paperclip />
        </button>

        <button type="button" className="text-gray-600 hover:text-black">
          <SmilePlus />
        </button>

        <button
          type="submit"
          className="text-gray-600 hover:text-black"
        >
          <SendHorizontal />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
