import React, { useState, useEffect } from 'react';
import ChatHeader   from '../chatComponents/chatHeader.jsx';
import MessageList  from '../chatComponents/messageList.jsx';
import MessageInput from '../chatComponents/messageInput.jsx';
import ChatList     from '../chatComponents/chatList.jsx';
import Sidebar      from '../chatComponents/sidebar.jsx';
import SearchFriend from '../chatComponents/searchFriend.jsx';
import socket       from '../socket/socket.js';
import api          from '../API.js';

const EmptyState = () => (
  <div className="flex flex-col flex-1 items-center justify-center bg-[#f7f8fc] gap-4">
    <div className="w-20 h-20 rounded-3xl bg-white shadow-md flex items-center
                    justify-center text-4xl">💬</div>
    <div className="text-center">
      <p className="text-base font-semibold text-gray-700 font-['Syne',sans-serif]">
        Your messages
      </p>
      <p className="text-sm text-gray-400 mt-1">
        Select a conversation or start a new one
      </p>
    </div>
  </div>
);

const Chat = () => {
  const myUserId = localStorage.getItem('userId');

  const [activeChat,     setActiveChat]     = useState(null);
  const [messages,       setMessages]       = useState([]);
  const [showSearch,     setShowSearch]     = useState(false);
  // ✅ highlightedMsgId: set by ChatHeader search, consumed by MessageList
  const [highlightedId,  setHighlightedId]  = useState(null);

  /* ── Fetch + socket messages ── */
  useEffect(() => {
    if (!activeChat) return;

    socket.emit('joinChat', activeChat._id);

    api.get(`/messages/${activeChat._id}`)
      .then((res) => setMessages(res.data || []))
      .catch(() => setMessages([]));

    const handleReceive = (newMsg) => {
      const incomingId = newMsg.chatID || newMsg.chatId || newMsg.chat;
      if (String(incomingId) !== String(activeChat._id)) return;
      setMessages((prev) => {
        if (prev.some((m) => m._id && m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
    };

    socket.on('receiveMessage', handleReceive);
    return () => socket.off('receiveMessage', handleReceive);
  }, [activeChat]);

  /* ── Presence ── */
  useEffect(() => {
    if (!myUserId) return;
    socket.emit('user-online', myUserId);
  }, [myUserId]);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');`}</style>

      <div className="h-screen flex overflow-hidden font-['DM_Sans',sans-serif]">
        <Sidebar onOpenSearch={() => { setShowSearch(true); setActiveChat(null); }} />

        {showSearch ? (
          <SearchFriend />
        ) : (
          <ChatList
            activeChatId={activeChat?._id}
            onSelectChat={(chat) => { setActiveChat(chat); setShowSearch(false); }}
          />
        )}

        {!showSearch && activeChat ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* ✅ Pass messages for in-chat search, onSearchResult to highlight */}
            <ChatHeader
              chat={activeChat}
              myUserId={myUserId}
              messages={messages}
              onSearchResult={(id) => setHighlightedId(id)}
            />
            {/* ✅ Pass highlightedId so MessageList can scroll to it */}
            <MessageList
              messages={messages}
              myUserId={myUserId}
              highlightedId={highlightedId}
            />
            <MessageInput chatId={activeChat._id} />
          </div>
        ) : (
          !showSearch && <EmptyState />
        )}
      </div>
    </>
  );
};

export default Chat;