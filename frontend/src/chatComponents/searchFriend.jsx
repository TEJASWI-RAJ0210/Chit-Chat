import React from "react";
import { Search } from "lucide-react";

const SearchFriend = () => {
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
              className="flex-grow bg-transparent outline-none text-sm text-gray-700"
            />
          </div>

          {/* Suggestions */}
          <p className="text-sm font-medium text-gray-500 mb-2">
            Suggestions
          </p>

          <ul className="bg-gray-50 rounded-xl p-3 space-y-2 shadow-inner">
            <li className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer">
              Tejaswi
            </li>
            <li className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer">
              Soumya
            </li>
            <li className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer">
              Anmolee
            </li>
          </ul>
          <p className="text-sm font-medium text-gray-500 mt-6 mb-2 text-center">
            Accept Request
          </p>

          <ul className="bg-gray-50 rounded-xl p-3 space-y-2 shadow-inner">
            <li className="flex justify-between items-center px-4 py-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 font-medium">Tejaswi</span>
              <div className="space-x-2">
                <button className="px-3 py-1 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
                  Accept
                </button>
                <button className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
                  Reject
                </button>
              </div>
            </li>

            <li className="flex justify-between items-center px-4 py-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 font-medium">Soumya</span>
              <div className="space-x-2">
                <button className="px-3 py-1 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
                  Accept
                </button>
                <button className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
                  Reject
                </button>
              </div>
            </li>

            <li className="flex justify-between items-center px-4 py-2 bg-white rounded-lg shadow-sm">
              <span className="text-gray-700 font-medium">Anmolee</span>
              <div className="space-x-2">
                <button className="px-3 py-1 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
                  Accept
                </button>
                <button className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
                  Reject
                </button>
              </div>
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
};

export default SearchFriend;
