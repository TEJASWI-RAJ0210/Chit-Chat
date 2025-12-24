import React from "react";
import bg from "../assets/avatar.png";
import { Phone, Video, MoreVertical } from "lucide-react";

const ChatHeader = ({ user }) => {
  return (
    <div className="w-[1131px] h-[74px] bg-cyan-200 border-b flex items-center justify-between px-6 border-r ml-[309px]">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <img
          src={user?.avatar || bg}
          alt="user"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-gray-800">
            {user?.name || "Tejaswi"}
          </p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 text-gray-600">
        <button className=" ">
          <Phone size={20} color="black" />
        </button>
        <button className=" ">
          <Video size={20} color="black" />
        </button>
        <button className="w-27 h-27">
          <MoreVertical size={20} color="black" />
        </button>
      </div>

    </div>
  );
};

export default ChatHeader;
