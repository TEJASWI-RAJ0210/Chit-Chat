import React, { useState } from "react";
import bg from "../assets/Username_bg.png";

const UserName = () => {
  const [username, setUsername] = useState("alex12");
  const suggestedUsernames = ["alex_123", "alex.smith", "alex_s"];

  return (
    <div className="flex h-screen w-full items-center justify-center" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Main Content */}
      <div className="flex flex-col items-center space-y-6 text-center">
        {/* Logo Top Left */}
        <div className="absolute top-6 left-6 flex items-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white font-bold text-lg">
            CC
          </div>
          <span className="text-black font-medium text-lg">Chit-Chat</span>
        </div>

        {/* Title Section */}
        <div className="flex justify-center backdrop-blur-xl bg-white/30 shadow-md h-350 w-350 p-20 rounded-xl mb-6">
          <div className="">
            <h1 className="text-2xl font-semibold text-gray-800">
            Choose Your Identity
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Pick a unique username for your account
            </p>

            {/* Username Input */}
          <div className="mt-6">
            <div className="flex items-center border border-black rounded-md bg-white shadow-sm">
              <span className="px-3 text-gray-500">@</span>
              <input
                type="text"
                value={username}
                className="w-64 py-2 px-2 outline-none rounded-r-md text-gray-800 border-black"
              />
            </div>
            <p className="text-xs text-red-500 mt-1">
              <span className="text-green-600 text-xs"><u>username is available!</u></span>
              <span className="text-gray-500 text-sm"> OR </span>
              <span className="text-red-600 text-xs"> <u> username is already taken.</u></span>
            </p>
          </div>

          {/* Suggested Usernames */}
          <div className="mt-6 text-[#333333] text-sm">or try</div>
          <div className="flex space-x-4 mt-5">
            {suggestedUsernames.map((name) => (
              <button
                key={name}
                onClick={() => setUsername(name)}
                className="px-10 py-1 bg-[#FAF8F580] hover:bg-gray-200 border border-black rounded-full text-sm flex items-center space-x-1"
              >
                <span className="text-">@{name}</span>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <button className="mt-8 px-20 py-2 bg-[#1F2B44] hover:bg-[#1F2B55] text-white rounded-md shadow-md">
            Continue
          </button>
        </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-4 text-xs text-gray-600">
          © 2025 All Rights Reserved. Chit-Chat
        </footer>
      </div>
    </div>
  );
};

export default UserName;