import React, { useState } from "react";
import bg from "../assets/Username_bg.png";
import { useNavigate } from "react-router-dom";
import api from "../API.js";

const UserName = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(null);
  const debounceTimer = React.useRef(null);

  const generateRandomUsername = () => {
    const adjectives = ["cool", "fast", "happy", "smart", "lucky", "brave", "funny", "wild", "quiet", "bright"];
    const animals = ["lion", "tiger", "bear", "wolf", "fox", "eagle", "owl", "shark", "panda", "koala"];
    const number = Math.floor(Math.random() * 1000);
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return `${adj}_${animal}${number}`;
  };

  const suggestedUsernames = React.useMemo(() => [
    generateRandomUsername(),
    generateRandomUsername(),
    generateRandomUsername()
  ], []);

  const checkUsernameAvailability = async (name) => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      const res = await api.post("/auth/check-username", { username: name });
      setAvailable(res.data.available);
      setError(res.data.available ? "" : "Username already taken");
    } catch {
      setAvailable(false);
      setError("Error checking username");
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    setUsername(value);
    setAvailable(null);
    setError("");

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      checkUsernameAvailability(value);
    }, 5000);
  };


const handleContinue = async () => {
    if (!available) return;
    const userId = localStorage.getItem("userId");

    try {
      setLoading(true);
      await api.post("/auth/set-username", {
        userId,
        username,
      });

      localStorage.setItem("username", username);
      navigate("/Settings");
    } catch (err) {
      setError("Failed to set username", err);
    } finally {
      setLoading(false);
    }
  };

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
                onChange={handleChange}
                className="w-64 py-2 px-2 outline-none rounded-r-md text-gray-800 border-black"
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>
            <p className="text-xs mt-1">
              {loading && <span className="text-gray-700">Checking availability...</span>}
              {!loading && available === true && <span className="text-green-600"><u>Username is available!</u></span>}
              {!loading && available === false && <span className="text-red-600"><u>{error || "Username is already taken."}</u></span>}
            </p>
          </div>

          {/* Suggested Usernames */}
          <div className="mt-6 text-[#333333] text-sm">or try</div>
          <div className="flex space-x-4 mt-5">
            {suggestedUsernames.map((name) => (
              <button
                key={name}
                onClick={async () => {
                  setUsername(name);
                  setError("");
                  setAvailable(null);
                  await checkUsernameAvailability(name);
                }}
                className="px-10 py-1 bg-[#FAF8F580] hover:bg-gray-200 border border-black rounded-full text-sm flex items-center space-x-1"
                disabled={loading}
              >
                <span className="text-">@{name}</span>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          
          <button
         
            className="mt-8 px-20 py-2 bg-[#1F2B44] hover:bg-[#1F2B55] text-white rounded-md shadow-md disabled:opacity-60"
            onClick={handleContinue}
            disabled={loading || !username || available === false}
          >
            {loading ? "Checking..." : "Continue"}
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