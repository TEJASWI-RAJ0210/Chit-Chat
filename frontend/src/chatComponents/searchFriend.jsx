import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  rejectFriendRequest,
  acceptFriendRequest,
  sendFriendRequest,
  searchUser,
  getFriendRequests,
} from "../API.js";

const SearchFriend = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* 🔍 Search user */
  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await searchUser(query);
      setResults([res.data]); // API returns single user
    } catch (err) {
      setResults([]);
      setError("User not found");
    } finally {
      setLoading(false);
    }
  };

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
    await acceptFriendRequest(id);
    setRequests(prev => prev.filter(u => u._id !== id));
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

export default SearchFriend;