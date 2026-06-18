import React, { useState, useEffect, useRef } from 'react';
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

  const [activeChat,    setActiveChat]    = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [showSearch,    setShowSearch]    = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);

  // ✅ Keep a ref to activeChat so the reconnect handler always
  // has the latest value without needing it as a dependency
  const activeChatRef = useRef(null);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  /* ── Presence + reconnection ── */
  useEffect(() => {
    if (!myUserId) return;

    const registerOnline = () => {
      socket.emit('user-online', myUserId);

      // ✅ Re-join active chat room on every reconnect
      // Without this, after a disconnect the socket loses room membership
      // and io.to(chatId).emit() never reaches it — causing the "need to
      // refresh" bug
      if (activeChatRef.current?._id) {
        socket.emit('joinChat', activeChatRef.current._id);
      }

      // Re-request online users list
      socket.emit('request-online-users');
    };

    if (socket.connected) registerOnline();
    socket.on('connect', registerOnline);

    return () => socket.off('connect', registerOnline);
  }, [myUserId]);

  /* ── Fetch messages + join room + listen for new messages ── */
  useEffect(() => {
    if (!activeChat) return;

    // Join the room for this chat
    socket.emit('joinChat', activeChat._id);

    // Fetch existing messages
    api.get(`/messages/${activeChat._id}`)
      .then((res) => setMessages(res.data || []))
      .catch(() => setMessages([]));

    // Listen for new real-time messages
    const handleReceive = (newMsg) => {
      const incomingId = String(newMsg.chatID || newMsg.chatId || newMsg.chat || '');
      if (incomingId !== String(activeChat._id)) return;

      setMessages((prev) => {
        // Prevent duplicates (REST + socket can both deliver the same message)
        if (prev.some((m) => m._id && m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
    };

    socket.on('receiveMessage', handleReceive);
    return () => socket.off('receiveMessage', handleReceive);
  }, [activeChat]);

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
            <ChatHeader
              chat={activeChat}
              myUserId={myUserId}
              messages={messages}
              onSearchResult={(id) => setHighlightedId(id)}
            />
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