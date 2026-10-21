import React, { useState, useEffect, useRef } from 'react';
import ChatHeader   from '../../components/chat/ChatHeader.jsx';
import MessageList  from '../../components/chat/MessageList.jsx';
import MessageInput from '../../components/chat/MessageInput.jsx';
import ChatList     from '../../components/chat/ChatList.jsx';
import Sidebar      from '../../components/navigation/Sidebar.jsx';
import SearchFriend from '../../components/chat/SearchFriend.jsx';
import socket, { setSocketUser } from '../../socket/socket.js';
import api          from '../../services/api.js';
import chatBg       from '../../assets/chat_bg.svg';

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
  const normalizeId = (v) => (v ? String(v) : '');

  const [activeChat,    setActiveChat]    = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [showSearch,    setShowSearch]    = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [typingUser,    setTypingUser]    = useState('');

  useEffect(() => {
    if (myUserId) setSocketUser(myUserId);
  }, [myUserId]);

  const activeChatRef = useRef(null);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  /* ── Room rejoin on reconnect ── */
  useEffect(() => {
    const handleReconnect = () => {
      if (activeChatRef.current?._id) socket.emit('joinChat', activeChatRef.current._id);
      socket.emit('request-online-users');
    };
    socket.on('connect', handleReconnect);
    return () => socket.off('connect', handleReconnect);
  }, []);

  const markSeen = (chatId) => {
    if (!chatId || !myUserId) return;
    api.put(`/messages/${chatId}/seen`, { userId: myUserId })
      .catch((e) => console.error('Failed to mark messages as seen:', e));
  };

  /* ── Fetch messages + join room + receive ── */
  useEffect(() => {
    if (!activeChat) return;

    // Clear typing state when switching chats
    setTypingUser('');

    socket.emit('joinChat', activeChat._id);

    const loadChat = async () => {
      try {
        const res = await api.get(`/messages/${activeChat._id}`);
        setMessages(res.data || []);
        markSeen(activeChat._id);
      } catch (err) {
        console.error(err);
        setMessages([]);
      }
    };
    loadChat();

    const handleReceive = (newMsg) => {
      const incomingId = normalizeId(newMsg.chatID || newMsg.chatId || newMsg.chat);
      if (incomingId !== normalizeId(activeChat._id)) return;
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
      const senderId = normalizeId(newMsg.senderID?._id || newMsg.senderID);
      if (senderId && senderId !== normalizeId(myUserId)) {
        markSeen(activeChat._id);
      }
    };

    socket.on('receiveMessage', handleReceive);
    return () => socket.off('receiveMessage', handleReceive);
  }, [activeChat, myUserId]);

  /* ── Seen receipts ── */
  useEffect(() => {
    const handleMessagesSeen = ({ chatId, messageIds = [] }) => {
      if (normalizeId(chatId) !== normalizeId(activeChat?._id)) return;
      const seenIds = new Set(messageIds.map(normalizeId));
      setMessages((prev) =>
        prev.map((msg) => seenIds.has(normalizeId(msg._id)) ? { ...msg, isSeen: true } : msg)
      );
    };
    socket.on('messages-seen', handleMessagesSeen);
    return () => socket.off('messages-seen', handleMessagesSeen);
  }, [activeChat]);

  /* ── Typing indicator ──
     ✅ FIX: activeChat is in the dep array so the handlers always
     see the current chat ID. Previously [] caused a stale closure
     where activeChat was always null → condition always failed →
     setTypingUser never called.                                    */
  useEffect(() => {
    const handleTyping = ({ senderName, chatID }) => {
      // ✅ FIX: String() on both sides — strict === fails when types differ
      if (String(chatID) !== String(activeChat?._id)) return;
      setTypingUser(senderName);
    };

    const handleStopTyping = ({ chatID }) => {
      if (String(chatID) !== String(activeChat?._id)) return;
      setTypingUser('');
    };

    socket.on('user-typing',      handleTyping);
    socket.on('user-stop-typing', handleStopTyping);

    return () => {
      socket.off('user-typing',      handleTyping);
      socket.off('user-stop-typing', handleStopTyping);
    };
  }, [activeChat]); // ✅ re-register whenever active chat changes

  const targetUserId = activeChat?.participants
    ?.find((u) => normalizeId(u._id) !== normalizeId(myUserId))?._id;

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
          <div
            className="flex flex-col flex-1 overflow-hidden"
            style={{
              backgroundImage: `url(${chatBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <ChatHeader
              chat={activeChat}
              myUserId={myUserId}
              messages={messages}
              onSearchResult={(id) => setHighlightedId(id)}
              typingUser={typingUser}
            />
            <MessageList
              messages={messages}
              myUserId={myUserId}
              highlightedId={highlightedId}
            />
            <MessageInput
              chatId={activeChat._id}
              targetUserId={targetUserId}
            />
          </div>
        ) : (
          !showSearch && <EmptyState />
        )}
      </div>

    </>
  );
};

export default Chat;
