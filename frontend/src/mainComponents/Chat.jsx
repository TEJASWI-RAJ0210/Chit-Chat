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
  const normalizeId = (value) => (value ? String(value) : '');

  const [activeChat,    setActiveChat]    = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [showSearch,    setShowSearch]    = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [incomingCall,  setIncomingCall]  = useState(null);
  const [typingUser, setTypingUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (myUserId) setSocketUser(myUserId);
  }, [myUserId]);

  const activeChatRef = useRef(null);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  /* ── Room rejoin on reconnect ── */
  useEffect(() => {
    const handleReconnect = () => {
      if (activeChatRef.current?._id) {
        socket.emit('joinChat', activeChatRef.current._id);
      }
      socket.emit('request-online-users');
    };
    socket.on('connect', handleReconnect);
    return () => socket.off('connect', handleReconnect);
  }, []);

  // ✅ Helper: mark unseen messages in the currently open chat as seen.
  // Called both on chat open AND whenever a new message arrives while
  // the chat is already open — fixes the "seen tick never updates for
  // newer messages" bug.
  const markSeen = (chatId) => {
    if (!chatId || !myUserId) return;
    api.put(`/messages/${chatId}/seen`, { userId: myUserId }).catch((e) => {
      console.error('Failed to mark messages as seen:', e);
    });
  };

  /* ── Fetch messages + join room + receive new messages ── */
  useEffect(() => {
    if (!activeChat) return;

    socket.emit('joinChat', activeChat._id);

    const loadChat = async () => {
      try {
        const res = await api.get(`/messages/${activeChat._id}`);
        setMessages(res.data || []);
        // Mark everything currently unseen as seen on open
        markSeen(activeChat._id);
      } catch (err) {
        console.error(err);
        setMessages([]);
      }
    };

    loadChat();

    const handleReceive = (newMsg) => {
      const incomingId = String(newMsg.chatID || newMsg.chatId || newMsg.chat || '');
      if (incomingId !== String(activeChat._id)) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });

      // ✅ FIX 3: if this new message is from the OTHER person and we
      // already have this chat open, mark it seen immediately instead
      // of waiting for the next time the chat is opened.
      const senderId = String(newMsg.senderID?._id || newMsg.senderID || '');
      if (senderId && senderId !== String(myUserId)) {
        markSeen(activeChat._id);
      }
    };

    socket.on('receiveMessage', handleReceive);
    return () => socket.off('receiveMessage', handleReceive);
  }, [activeChat, myUserId]);

  /* ── Listen for seen receipts ── */
  useEffect(() => {
    const handleMessagesSeen = ({ chatId, messageIds = [] }) => {
      if (normalizeId(chatId) !== normalizeId(activeChat?._id)) return;

      const seenIds = new Set(messageIds.map((id) => normalizeId(id)));
      setMessages((prev) =>
        prev.map((msg) =>
          seenIds.has(normalizeId(msg._id)) ? { ...msg, isSeen: true } : msg
        )
      );
    };

    socket.on('messages-seen', handleMessagesSeen);
    return () => socket.off('messages-seen', handleMessagesSeen);
  }, [activeChat]);

  /* ── Incoming calls ── */
  useEffect(() => {
    const handleIncomingCall = (data) => setIncomingCall(data);
    socket.on('incoming-call', handleIncomingCall);
    return () => socket.off('incoming-call', handleIncomingCall);
  }, []);

  useEffect(() => {

  const handleTyping = ({ senderName, chatID }) => {
    if (String(chatID) !== String(activeChat?._id))
        return;
    setTypingUser(senderName);
  };

  const handleStopTyping = ({ chatID }) => {
    if (String(chatID) !== String(activeChat?._id))
        return;
    setTypingUser("");
  };

  socket.on(
    "user-typing",
    handleTyping
  );

  socket.on(
    "user-stop-typing",
    handleStopTyping
  );

  return () => {

    socket.off(
      "user-typing",
      handleTyping
    );

    socket.off(
      "user-stop-typing",
      handleStopTyping
    );

  };

}, [activeChat?._id]);

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
              targetUserId={
                activeChat.participants.find((u) => String(u._id) !== String(myUserId))?._id
             }
            />
          </div>
        ) : (
          !showSearch && <EmptyState />
        )}
      </div>

      {incomingCall && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h2 className="text-xl font-bold">Incoming Video Call</h2>
            <p className="mt-3">Someone is calling you...</p>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  socket.emit('accept-call', {
                    callerId: incomingCall.callerId,
                    receiverId: myUserId,
                  });
                  navigate(`/video-call/${incomingCall.callerId}`);
                  setIncomingCall(null);
                }}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg"
              >
                Accept
              </button>
              <button
                onClick={() => setIncomingCall(null)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
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