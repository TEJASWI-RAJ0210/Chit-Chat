import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { Search, UserPlus, Check, X, Users } from "lucide-react";
=======
import { Search } from "lucide-react";
>>>>>>> c87fe41b76793837656014758f2e52d615d56cca
import {
  rejectFriendRequest,
  acceptFriendRequest,
  sendFriendRequest,
  searchUser,
  getFriendRequests,
  createChat,
} from "../API.js";

<<<<<<< HEAD
const getAvatar = (user) =>
  user?.profilePic ||
  `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?._id || user?.username || "default"}`;

const Toast = ({ toast }) =>
  toast ? (
    <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-medium
                     shadow-xl z-50 transition-all
                     ${toast.type === "success" ? "bg-[#00e5a0] text-[#0f1117]" : "bg-red-500 text-white"}`}>
      {toast.msg}
    </div>
  ) : null;

const SearchFriend = () => {
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [toast,    setToast]    = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
=======
const SearchFriend = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* 🔍 Search user */
  const handleSearch = async () => {
    if (!query.trim()) return;

>>>>>>> c87fe41b76793837656014758f2e52d615d56cca
    setLoading(true);
    setError("");
    try {
      const res = await searchUser(query);
<<<<<<< HEAD
      setResults([res.data]);
    } catch {
      setResults([]);
      setError("No user found with that username.");
=======
      setResults([res.data]); // API returns single user
    } catch (err) {
      setResults([]);
      setError("User not found");
>>>>>>> c87fe41b76793837656014758f2e52d615d56cca
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const sendRequest = async (id) => {
    try {
      await sendFriendRequest(id);
      showToast("success", "Friend request sent!");
      setResults([]);
      setQuery("");
    } catch {
      showToast("error", "Failed to send request.");
    }
  };

  const acceptRequest = async (id) => {
    try {
      await acceptFriendRequest(id);
      try { await createChat(id); } catch {}
      setRequests((prev) => prev.filter((u) => u._id !== id));
      showToast("success", "Friend request accepted!");
    } catch {
      showToast("error", "Failed to accept request.");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await rejectFriendRequest(id);
      setRequests((prev) => prev.filter((u) => u._id !== id));
    } catch {
      showToast("error", "Failed to reject request.");
    }
  };

  useEffect(() => {
    getFriendRequests()
      .then((res) => setRequests(res.data || []))
      .catch(() => setRequests([]));
  }, []);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');`}</style>

      <div className="flex flex-col flex-1 h-full bg-[#15181f] overflow-y-auto
                      font-['DM_Sans',sans-serif]">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 shrink-0">
          <h2 className="text-white font-['Syne',sans-serif] font-semibold text-xl tracking-tight mb-1">
            Find Friends
          </h2>
          <p className="text-sm text-gray-500">Search by username to connect with people</p>

          {/* Search bar */}
          <div className="flex items-center gap-3 mt-5 bg-white/5 border border-white/10
                          rounded-2xl px-4 py-3 focus-within:border-[#00e5a0]/50
                          focus-within:ring-1 focus-within:ring-[#00e5a0]/20 transition-all">
            <Search size={15} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search by username…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={!query.trim() || loading}
              className="px-4 py-1.5 bg-[#00e5a0] text-[#0f1117] text-xs font-semibold
                         rounded-xl hover:bg-[#00c98d] disabled:opacity-40 transition-colors"
            >
              {loading ? "…" : "Search"}
            </button>
          </div>
        </div>

        <div className="px-6 pb-8 flex flex-col gap-6">

          {/* Search results */}
          {(results.length > 0 || error) && (
            <Section title="Search Results" icon={<UserPlus size={14} />}>
              {error && (
                <p className="text-xs text-gray-500 text-center py-4">{error}</p>
              )}
              {results.map((user) => (
                <UserRow key={user._id} user={user}>
                  <button
                    onClick={() => sendRequest(user._id)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00e5a0] text-[#0f1117]
                               text-xs font-semibold rounded-xl hover:bg-[#00c98d] transition-colors"
                  >
                    <UserPlus size={12} />
                    Add
                  </button>
                </UserRow>
              ))}
            </Section>
          )}

          {/* Pending requests */}
          <Section
            title="Pending Requests"
            icon={<Users size={14} />}
            count={requests.length}
          >
            {requests.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-4">
                No pending friend requests
              </p>
            ) : (
              requests.map((user) => (
                <UserRow key={user._id} user={user}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => acceptRequest(user._id)}
                      className="w-8 h-8 rounded-xl bg-[#00e5a0]/15 text-[#00e5a0]
                                 hover:bg-[#00e5a0]/25 flex items-center justify-center transition-colors"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => rejectRequest(user._id)}
                      className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400
                                 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </UserRow>
              ))
            )}
          </Section>
        </div>
      </div>

      <Toast toast={toast} />
    </>
  );
};

/* ── Small helpers ── */
const Section = ({ title, icon, count, children }) => (
  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
      <span className="text-[#00e5a0]">{icon}</span>
      <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
        {title}
      </span>
      {count > 0 && (
        <span className="ml-auto w-5 h-5 rounded-full bg-[#00e5a0] text-[#0f1117]
                         text-[10px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
    <div className="px-3 py-2">{children}</div>
  </div>
);

const UserRow = ({ user, children }) => (
  <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
    <img
      src={getAvatar(user)}
      alt={user.username}
      className="w-9 h-9 rounded-2xl object-cover shrink-0"
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white truncate">
        {user.fullName || user.username}
      </p>
      {user.fullName && (
        <p className="text-xs text-gray-500 truncate">@{user.username}</p>
      )}
    </div>
    {children}
  </div>
);

=======
  /* ➕ Send friend request */
  const sendRequest = async (id) => {
    try {
      await sendFriendRequest(id);
      alert("Friend request sent");
      setResults([]);
      setQuery("");
    } catch {
      alert("Failed to send request");
    }
  };

  /* ✅ Accept request */
  const acceptRequest = async (id) => {
    try {
      const res = await acceptFriendRequest(id);
      // try to create/fetch chat immediately so it appears in chat list
      try { await createChat(id); } catch (e) { /* ignore chat create errors */ }
      setRequests(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      alert('Failed to accept request');
    }
  };

  /* ❌ Reject request */
  const rejectRequest = async (id) => {
    await rejectFriendRequest(id);
    setRequests(prev => prev.filter(u => u._id !== id));
  };

  /* 📥 Fetch incoming requests */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getFriendRequests();
        setRequests(res.data || []);
      } catch {
        setRequests([]);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="flex flex-1 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full p-6 overflow-auto">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">

          <p className="text-lg font-semibold text-gray-800 text-center mb-5">
            Add Friend
          </p>

          <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 shadow-sm mb-6 focus-within:ring-2 focus-within:ring-indigo-400">
            <Search className="text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search friend"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-grow bg-transparent outline-none text-sm text-gray-700"
            />
          </div>

          <p className="text-sm font-medium text-gray-500 mt-6 mb-2 text-center">
            Accept Request
          </p>

          <ul className="bg-gray-50 rounded-xl p-3 space-y-2 shadow-inner">
            {requests.length === 0 && (
              <p className="text-center text-sm text-gray-400">
                No pending requests
              </p>
            )}

            {requests.map(user => (
              <li
                key={user._id}
                className="flex justify-between items-center px-4 py-2 bg-white rounded-lg shadow-sm"
              >
                <span className="text-gray-700 font-medium">
                  {user.username}
                </span>

                <div className="space-x-2">
                  <button
                    onClick={() => acceptRequest(user._id)}
                    className="px-3 py-1 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => rejectRequest(user._id)}
                    className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <ul className="bg-gray-50 rounded-xl p-3 space-y-2 shadow-inner mt-4">
            {loading && (
              <p className="text-center text-sm text-gray-400">
                Searching...
              </p>
            )}

            {!loading && error && (
              <p className="text-center text-sm text-gray-400">
                {error}
              </p>
            )}

            {results.map((user) => (
              <li
                key={user._id}
                className="flex justify-between items-center px-4 py-2 bg-white rounded-lg shadow-sm"
              >
                <span className="text-gray-700 font-medium">
                  {user.username}
                </span>

                <button
                  onClick={() => sendRequest(user._id)}
                  className="px-3 py-1 text-xs rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
};

>>>>>>> c87fe41b76793837656014758f2e52d615d56cca
export default SearchFriend;