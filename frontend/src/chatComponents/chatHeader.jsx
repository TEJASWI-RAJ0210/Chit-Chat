import React, { useEffect, useState, useRef } from 'react';
import { Video, Phone, MoreVertical, Search, Info, X } from 'lucide-react';
import socket from '../socket/socket.js';
import UserInfoCard from './UserInfoCard.jsx';
import { useNavigate } from 'react-router-dom';

const getAvatar = (user) =>
  user?.profilePic ||
  `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?._id || 'default'}`;

const ChatHeader = ({ chat, myUserId, messages = [], onSearchResult }) => {
  const [onlineUsers, setOnline]     = useState([]);
  const [showInfo,    setShowInfo]   = useState(false);
  const [showMenu,    setShowMenu]   = useState(false);
  const [showSearch,  setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchIndex,  setMatchIndex]  = useState(0);
  const [matches,     setMatches]     = useState([]);
  const searchRef = useRef(null);
  const menuRef   = useRef(null);
  const navigate  = useNavigate();

  const otherUser = chat?.participants?.find((u) => u._id !== myUserId);
  const isOnline  = onlineUsers.includes(otherUser?._id);

  /* ── Online users ── */
  useEffect(() => {
    const fn = (list) => setOnline(list);
    socket.on('online-users', fn);

    // ✅ Request current list immediately on mount
    // so we don't wait for the next broadcast
    socket.emit('request-online-users');

    return () => socket.off('online-users', fn);
  }, []);

  /* ── Incoming call ── */
  useEffect(() => {
    // ✅ Store reference so we can remove exactly this handler
    const handleIncomingCall = (data) => {
      console.log('Incoming call:', data);
      alert(`Incoming call from ${data.callerId}`);
    };

    socket.on('incoming-call', handleIncomingCall);
    // ✅ Pass the reference — without it socket.off removes ALL incoming-call listeners
    return () => socket.off('incoming-call', handleIncomingCall);
  }, []);

  /* ── Close menu on outside click ── */
  useEffect(() => {
    const fn = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* ── Focus search input ── */
  useEffect(() => {
    if (showSearch) setTimeout(() => searchRef.current?.focus(), 50);
    else { setSearchQuery(''); setMatches([]); setMatchIndex(0); }
  }, [showSearch]);

  /* ── Search messages ── */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMatches([]); setMatchIndex(0); onSearchResult?.(null); return;
    }
    const q   = searchQuery.toLowerCase();
    const hit = messages
      .map((m, i) => ({ index: i, id: m._id, text: m.text || m.content || '' }))
      .filter((m) => m.text.toLowerCase().includes(q));
    setMatches(hit);
    setMatchIndex(0);
    if (hit.length > 0) onSearchResult?.(hit[0].id);
  }, [searchQuery, messages]);

  const goToMatch = (dir) => {
    if (!matches.length) return;
    const next = (matchIndex + dir + matches.length) % matches.length;
    setMatchIndex(next);
    onSearchResult?.(matches[next].id);
  };

  const closeSearch = () => { setShowSearch(false); onSearchResult?.(null); };

  const handleVideoCall = () => {
    if (!otherUser?._id) return;
    navigate(`/video-call/${otherUser._id}`);
  };

  return (
    <>
      <div className="shrink-0 flex items-center gap-3 px-5 py-3.5
                      bg-white border-b border-gray-100 shadow-sm relative z-10">
        {!showSearch ? (
          <>
            {/* Avatar */}
            <div className="relative">
              <img
                src={getAvatar(otherUser)}
                alt={otherUser?.fullName || 'User'}
                className="w-10 h-10 rounded-2xl object-cover"
              />
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full
                                border-2 border-white
                                ${isOnline ? 'bg-[#00e5a0]' : 'bg-gray-300'}`} />
            </div>

            {/* Name + status */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate font-['Syne',sans-serif]">
                {otherUser?.fullName || otherUser?.username || 'Unknown'}
              </p>
              <p className={`text-xs font-medium ${isOnline ? 'text-[#00b87a]' : 'text-gray-400'}`}>
                {isOnline ? '● Online' : '○ Offline'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <ActionBtn icon={Search} onClick={() => setShowSearch(true)} title="Search" />
              <ActionBtn icon={Phone}  title="Call" />
              <ActionBtn icon={Video}  onClick={handleVideoCall} title="Video" />

              <div className="relative" ref={menuRef}>
                <ActionBtn
                  icon={MoreVertical}
                  onClick={() => setShowMenu((p) => !p)}
                  active={showMenu}
                  title="More"
                />
                {showMenu && (
                  <div className="absolute right-0 top-11 w-44 bg-white border border-gray-100
                                  rounded-2xl shadow-xl overflow-hidden z-30
                                  animate-[fadeIn_.15s_ease-out]">
                    <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}`}</style>
                    <button
                      onClick={() => { setShowInfo(true); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm
                                 text-gray-700 hover:bg-[#f7f8fc] transition-colors"
                    >
                      <Info size={15} className="text-[#00b87a]" />
                      View Info
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Search bar */
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 flex-1 bg-[#f7f8fc] border
                            border-[#00e5a0]/50 rounded-xl px-3 py-2 ring-2 ring-[#00e5a0]/10">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search in conversation…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter')  goToMatch(e.shiftKey ? -1 : 1);
                  if (e.key === 'Escape') closeSearch();
                }}
                className="flex-1 bg-transparent text-sm text-gray-700
                           placeholder-gray-400 outline-none"
              />
              {searchQuery.trim() && (
                <span className="text-[11px] text-gray-400 shrink-0 font-medium">
                  {matches.length === 0 ? 'No results' : `${matchIndex + 1} / ${matches.length}`}
                </span>
              )}
            </div>
            {matches.length > 1 && (
              <div className="flex gap-1">
                <NavBtn onClick={() => goToMatch(-1)} label="↑" title="Previous" />
                <NavBtn onClick={() => goToMatch(1)}  label="↓" title="Next" />
              </div>
            )}
            <button onClick={closeSearch}
                    className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200
                               flex items-center justify-center text-gray-500 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {showInfo && (
        <UserInfoCard user={otherUser} onClose={() => setShowInfo(false)} />
      )}
    </>
  );
};

const ActionBtn = ({ icon: Icon, onClick, active, title }) => (
  <button onClick={onClick} title={title}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors
                      ${active
                        ? 'bg-[#00e5a0]/10 text-[#00b87a]'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}>
    <Icon size={17} />
  </button>
);

const NavBtn = ({ onClick, label, title }) => (
  <button onClick={onClick} title={title}
          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200
                     flex items-center justify-center text-gray-500
                     text-xs font-bold transition-colors">
    {label}
  </button>
);

export default ChatHeader;