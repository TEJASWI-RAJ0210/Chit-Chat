import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../chatComponents/sidebar.jsx";
import MessageList from "../chatComponents/messageList.jsx";
import MessageInput from "../chatComponents/messageInput.jsx";
import { RiGeminiFill } from "react-icons/ri";
import { Sparkles, RotateCcw } from "lucide-react";
import api from "../API.js";

const SUGGESTIONS = [
  "What can you help me with?",
  "Tell me a fun fact 🎲",
  "Help me write a message to a friend",
  "Explain something in simple terms",
];

const myUserId = "me";

const TypingIndicator = () => (
  <div className="flex items-end gap-2 px-6 py-1">
    <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#00e5a0] to-[#00b87a]
                    flex items-center justify-center shrink-0 shadow-sm">
      <RiGeminiFill size={14} className="text-[#0f1117]" />
    </div>
    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const ChatAiPage = () => {
  const [messages, setMessages] = useState([
    {
      _id: "intro",
      text: "Hey there! 👋 I'm your AI assistant powered by Groq. Ask me anything — I'm here to help.",
      senderID: "ai",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text) => {
    const userMsg = {
      _id: Date.now().toString(),
      text,
      senderID: myUserId,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await api.post("/ai/chat", { message: text });
      setMessages((prev) => [
        ...prev,
        {
          _id: (Date.now() + 1).toString(),
          text: res.data.reply,
          senderID: "ai",
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          _id: (Date.now() + 1).toString(),
          text: "Sorry, I ran into an issue. Please try again.",
          senderID: "ai",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        _id: "intro-" + Date.now(),
        text: "Conversation cleared. What would you like to talk about?",
        senderID: "ai",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const showSuggestions = messages.length <= 1 && !isLoading;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');`}</style>

      <div className="h-screen flex overflow-hidden font-['DM_Sans',sans-serif]">
        <Sidebar />

        {/* Chat area */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Header */}
          <div className="shrink-0 flex items-center gap-3 px-5 py-3.5
                          bg-white border-b border-gray-100 shadow-sm">
            {/* AI avatar */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00e5a0] to-[#00b87a]
                            flex items-center justify-center shadow-[0_0_12px_rgba(0,229,160,0.3)]">
              <RiGeminiFill size={18} className="text-[#0f1117]" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 font-['Syne',sans-serif]">
                AI Assistant
              </p>
              <p className="text-xs text-[#00b87a] font-medium flex items-center gap-1">
                <Sparkles size={10} />
                Powered by Groq
              </p>
            </div>

            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs
                         text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <RotateCcw size={12} />
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 relative">
            <MessageList messages={messages} myUserId={myUserId} />

            {/* Typing indicator */}
            {isLoading && <TypingIndicator />}

            {/* Suggestion chips — shown only at start */}
            {showSuggestions && (
              <div className="px-6 pb-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSendMessage(s)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs
                               text-gray-600 hover:border-[#00e5a0]/60 hover:text-gray-800
                               hover:bg-[#f0fdf8] transition-all shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <MessageInput overrideOnSend={handleSendMessage} />
        </div>
      </div>
    </>
  );
};

export default ChatAiPage;
