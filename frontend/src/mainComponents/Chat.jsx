import React, { useState, useEffect, useRef } from 'react';
import ChatHeader   from '../chatComponents/chatHeader.jsx';
import MessageList  from '../chatComponents/messageList.jsx';
import MessageInput from '../chatComponents/messageInput.jsx';
import ChatList     from '../chatComponents/chatList.jsx';
import Sidebar      from '../chatComponents/sidebar.jsx';
import SearchFriend from '../chatComponents/searchFriend.jsx';
import socket, { setSocketUser } from '../socket/socket.js';
import api          from '../API.js';
import chatBg       from '../assets/chat_bg.svg';
import { useNavigate } from 'react-router-dom';

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
  const [incomingCall,  setIncomingCall]  = useState(null);
  const [typingUser,    setTypingUser]    = useState('');
  const navigate = useNavigate();

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

  /* ── Incoming calls ── */
  useEffect(() => {
    const fn = (data) => setIncomingCall(data);
    socket.on('incoming-call', fn);
    return () => socket.off('incoming-call', fn);
  }, []);

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

      {incomingCall && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
            <h2 className="text-xl font-bold font-['Syne',sans-serif]">Incoming Video Call</h2>
            <p className="mt-3 text-gray-500 text-sm">Someone is calling you...</p>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  socket.emit('accept-call', { callerId: incomingCall.callerId, receiverId: myUserId });
                  navigate(`/video-call/${incomingCall.callerId}`);
                  setIncomingCall(null);
                }}
                className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => setIncomingCall(null)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;