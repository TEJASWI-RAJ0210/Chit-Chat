import React from 'react';
import { FiHome, FiGrid, FiBarChart2, FiBook, FiSettings } from 'react-icons/fi';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { RiGeminiFill } from "react-icons/ri";
import { FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-20 bg-gray-800 flex flex-col items-center py-6">
      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
        Logo
      </div>

      <div className="flex flex-col items-center gap-6 flex-1 mt-4">
        <div className="relative group">
          <FiHome 
            size={24} 
            className="text-gray-400 hover:text-green-500 cursor-pointer" 
            onClick={() => navigate('/chat')} 
          />
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Home</span>
        </div>

        {/* <div className="relative group">
                    <FiGrid size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" />
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Grid</span>
                  </div> */}

        {/* <div className="relative group">
                    <FiBarChart2 size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" />
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Analytics</span>
                  </div> */}

        {/* <div className="relative group">
                    <FiBook size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" />
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Docs</span>
                  </div> */}

        <div className="relative group">
          <FaUserFriends size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" onClick={() => navigate('/chat/searchFriend')} />
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Friends</span>
        </div>

        <div className="relative group">
          <RiGeminiFill size={24} className="hover:text-green-500 text-gray-400 cursor-pointer" onClick={() => navigate('/chat/ai-chat')} />
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">AI Help</span>
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center mt-4 gap-4">
        <div className="w-10 h-px bg-gray-600 rounded" />
        <div className="relative group">
          <FiSettings size={24} className="hover:text-green-500 text-gray-400 cursor-pointer" onClick={() => navigate('/chat/Settings')} />
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Settings</span>
        </div>

        <div className="relative group">
          <IoArrowBackCircleSharp size={26} className="hover:text-green-500 text-gray-400 cursor-pointer" onClick={() => navigate('/')} />
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Go BACK</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;