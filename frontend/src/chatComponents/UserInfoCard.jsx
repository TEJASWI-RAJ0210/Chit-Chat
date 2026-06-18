import React, { useEffect, useState } from 'react';
import { X, AtSign, MessageCircle, Clock } from 'lucide-react';
import api from '../API.js';
import socket from '../socket/socket.js';

const getAvatar = (user) =>
  user?.profilePic ||
  `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?._id || 'default'}`;

const formatLastSeen = (dateStr) => {
  if (!dateStr) return 'A while ago';
  const d       = new Date(dateStr);
  const now     = new Date();
  const diffMs  = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr  / 24);

  if (diffMin < 1)  return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr  < 24) return `${diffHr} hr ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7)  return `${diffDay} days ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const UserInfoCard = ({ user, onClose }) => {
  const [profile,      setProfile]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [onlineUsers,  setOnlineUsers]  = useState([]);

  /* ── Fetch full profile ── */
  useEffect(() => {
    if (!user?._id) return;
    api.get(`/user/${user._id}`)
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(user))
      .finally(() => setLoading(false));
  }, [user?._id]);

  /* ── Track online status ── */
  useEffect(() => {
    const fn = (list) => setOnlineUsers(list);
    socket.on('online-users', fn);
    return () => socket.off('online-users', fn);
  }, []);

  /* ── Close on Escape ── */
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  const data     = profile || user;
  const isOnline = onlineUsers.includes(String(data?._id));

  return (
    <>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateX(12px) scale(.97); }
          to   { opacity: 1; transform: translateX(0)    scale(1);   }
        }
        @keyframes avatarIn {
          from { opacity: 0; transform: scale(.85); }
          to   { opacity: 1; transform: scale(1);   }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="fixed right-4 top-[64px] w-[290px] z-50 rounded-3xl overflow-hidden
                   shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-white/60"
        style={{ animation: 'cardIn .2s cubic-bezier(.22,1,.36,1)' }}
      >
        {/* ── Banner ── */}
        <div className="h-24 bg-gradient-to-br from-[#0f1117] via-[#1a1f2e] to-[#0f1117]
                        relative overflow-hidden">
          {/* Subtle glow blobs */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full
                          bg-[#00e5a0]/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-4 left-4 w-20 h-20 rounded-full
                          bg-[#00e5a0]/10 blur-xl pointer-events-none" />

          {/* Close btn */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-xl bg-white/10
                       hover:bg-white/20 flex items-center justify-center
                       text-white/70 hover:text-white transition-all"
          >
            <X size={13} />
          </button>
        </div>

        {/* ── White body ── */}
        <div className="bg-white px-5 pb-6">

          {/* Avatar row — overlaps banner */}
          <div className="flex items-end justify-between -mt-9 mb-4">
            <div
              className="relative"
              style={{ animation: 'avatarIn .25s .05s cubic-bezier(.22,1,.36,1) both' }}
            >
              <img
                src={getAvatar(data)}
                alt={data?.fullName || 'User'}
                className="w-[72px] h-[72px] rounded-2xl object-cover
                           border-[3px] border-white shadow-lg"
              />
              {/* Online dot on avatar */}
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full
                                border-2 border-white shadow-sm
                                ${isOnline ? 'bg-[#00e5a0]' : 'bg-gray-300'}`} />
            </div>

            {/* Online / offline pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs
                             font-semibold border self-start mt-10
                             ${isOnline
                               ? 'bg-[#e6fdf5] border-[#a8edcc] text-[#00915a]'
                               : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full
                                ${isOnline ? 'bg-[#00e5a0] animate-pulse' : 'bg-gray-400'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>

          {loading ? (
            /* Skeleton */
            <div className="space-y-3 animate-pulse">
              <div className="h-5 bg-gray-100 rounded-lg w-2/3" />
              <div className="h-3 bg-gray-100 rounded-lg w-1/3" />
              <div className="h-16 bg-gray-100 rounded-xl w-full mt-4" />
            </div>
          ) : (
            <>
              {/* Name + username */}
              <h3 className="text-[15px] font-bold text-gray-900
                             font-['Syne',sans-serif] leading-tight">
                {data?.fullName || data?.username || 'Unknown'}
              </h3>
              {data?.username && (
                <div className="flex items-center gap-1 mt-0.5">
                  <AtSign size={11} className="text-[#00b87a]" />
                  <span className="text-xs text-[#00b87a] font-medium">
                    {data.username}
                  </span>
                </div>
              )}

              {/* Divider */}
              <div className="my-4 h-px bg-gray-100" />

              {/* Info rows */}
              <div className="flex flex-col gap-3">

                {/* Last seen */}
                <InfoRow
                  icon={<Clock size={13} className="text-gray-400" />}
                  label="Last seen"
                  value={
                    isOnline
                      ? <span className="text-[#00915a] font-medium">Active now</span>
                      : <span className="text-gray-600">
                          {formatLastSeen(data?.lastSeen)}
                        </span>
                  }
                />

                {/* Bio */}
                {data?.bio && (
                  <InfoRow
                    icon={<MessageCircle size={13} className="text-gray-400" />}
                    label="Bio"
                    value={
                      <span className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {data.bio}
                      </span>
                    }
                  />
                )}

                {!data?.bio && (
                  <p className="text-xs text-gray-400 italic text-center py-1">
                    No bio yet.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

/* ── Small helper row ── */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-6 h-6 rounded-lg bg-[#f7f8fc] flex items-center
                    justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">
        {label}
      </p>
      <div className="text-sm">{value}</div>
    </div>
  </div>
);

export default UserInfoCard;