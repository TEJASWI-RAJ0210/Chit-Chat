<<<<<<< HEAD
import React, { useState } from 'react';
import { FiHome, FiSettings } from 'react-icons/fi';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { RiGeminiFill } from 'react-icons/ri';
import { FaUserFriends } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV = [
  { icon: FiHome,               label: 'Home',     path: '/chat' },
  { icon: FaUserFriends,        label: 'Friends',  path: '/searchFriend', isSearch: true },
  { icon: RiGeminiFill,         label: 'AI Chat',  path: '/ai-chat' },
];

const BOTTOM = [
  { icon: FiSettings,               label: 'Settings', path: '/settings' },
  { icon: IoArrowBackCircleSharp,   label: 'Log out',  path: '/' },
];

const NavBtn = ({ icon: Icon, label, active, onClick }) => (
  <div className="relative group flex items-center justify-center w-full">
    <button
      onClick={onClick}
      className={`
        w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200
        ${active
          ? 'bg-[#00e5a0]/15 text-[#00e5a0] shadow-[0_0_12px_2px_rgba(0,229,160,0.15)]'
          : 'text-gray-500 hover:bg-white/8 hover:text-gray-200'}
      `}
    >
      <Icon size={20} />
    </button>

    {/* Active indicator bar */}
    {active && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#00e5a0] rounded-r-full" />
    )}

    {/* Tooltip */}
    <span className="
      pointer-events-none absolute left-[56px] top-1/2 -translate-y-1/2
      bg-[#1a1d27] border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg
      opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50
    ">
      {label}
    </span>
  </div>
);

const Sidebar = ({ onOpenSearch }) => {
  const navigate   = useNavigate();
  const location   = useLocation();

  const handleNav = (item) => {
    if (item.isSearch && onOpenSearch) {
      onOpenSearch();
    } else {
      navigate(item.path);
    }
  };

  return (
    <aside className="
      w-[72px] h-screen bg-[#0f1117] border-r border-white/[0.06]
      flex flex-col items-center py-5 gap-0 shrink-0
    ">
      {/* Logo */}
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00e5a0] to-[#00b87a]
                      flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,229,160,0.3)]">
        <span className="text-[#0f1117] font-black text-sm tracking-tighter select-none">CC</span>
      </div>

      {/* Top nav */}
      <nav className="flex flex-col items-center gap-2 flex-1 w-full px-2">
        {NAV.map((item) => (
          <NavBtn
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
            onClick={() => handleNav(item)}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-white/10 my-3" />

      {/* Bottom nav */}
      <div className="flex flex-col items-center gap-2 w-full px-2 pb-1">
        {BOTTOM.map((item) => (
          <NavBtn
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </aside>
  );
};
=======
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
>>>>>>> c87fe41b76793837656014758f2e52d615d56cca

export default Sidebar;