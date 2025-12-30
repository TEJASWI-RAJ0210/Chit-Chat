import React, { useState } from "react";
import Sidebar from "../chatComponents/sidebar.jsx";
import MessageList from "../chatComponents/messageList.jsx";
import MessageInput from "../chatComponents/messageInput.jsx";
import ChatHeader from "../chatComponents/chatHeader.jsx";
import bg from "../assets/chat_bg.jpeg";
import api from "../API.js";

const ChatAiPage = () => {
    const myUserId = "me"; // Placeholder for local user styling in AI chat
    const [messages, setMessages] = useState([
        {
            _id: "intro",
            text: "Hello! I am your AI assistant. How can I help you today?",
            senderID: "ai",
            createdAt: new Date().toISOString(),
        },
    ]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (text) => {
        // Add user message
        const userMsg = {
            _id: Date.now().toString(),
            text: text,
            senderID: myUserId,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const res = await api.post("/ai/chat", { message: text });

            const aiMsg = {
                _id: (Date.now() + 1).toString(),
                text: res.data.reply,
                senderID: "ai",
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, aiMsg]);

        } catch (error) {
            console.error("AI Chat Error:", error);
            const errorMsg = {
                _id: (Date.now() + 1).toString(),
                text: "Sorry, I encountered an error responding to that.",
                senderID: "ai",
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    // Mock chat object for Header
    const aiChatInfo = {
        chatName: "AI Assistant",
        isGroupChat: false,
        users: [],
        // You might want to add an avatar here if supported
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="flex flex-1">
                <Sidebar />

                {/* Main Chat Area - Full Width since no ChatList */}
                <div
                    className="flex flex-col flex-1 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bg}) ` }}
                >
                    {/* Custom Header or reuse ChatHeader with mock data */}
                    <div className="p-4 bg-white/90 border-b flex items-center shadow-sm">
                        <div className="font-bold text-xl text-rose-500">AI Assistant</div>
                    </div>

                    <MessageList messages={messages} myUserId={myUserId} />

                    {isLoading && (
                        <div className="px-6 py-2 text-sm text-gray-500 italic">
                            AI is thinking...
                        </div>
                    )}

                    <MessageInput overrideOnSend={handleSendMessage} />
                </div>
            </div>
        </div>
    );
};

export default ChatAiPage;
