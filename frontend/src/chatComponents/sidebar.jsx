import React from 'react';
import { FiHome, FiGrid, FiBarChart2, FiBook, FiSettings } from 'react-icons/fi';
import { FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onOpenSearch }) => {
    const navigate = useNavigate();

    return(
        <div className="w-20 bg-gray-800 flex flex-col items-center py-6 gap-6 ">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  Logo
                </div>
        
                <FiHome size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" />
                <FiGrid size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" />
                <FiBarChart2 size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" />
                <FiBook size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" />
                <FaUserFriends size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" onClick={() => { if(onOpenSearch) onOpenSearch(); else navigate('/searchFriend'); }} />
                <FiSettings size={24} className="text-green-500 cursor-pointer" onClick={() => navigate('/settings')} />
              </div>
    )
}

export default Sidebar;