import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye } from "react-icons/fa";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import bg from "../assets/SignIn_bg.png";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../API.js";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
       ...formData, 
       [e.target.name]: e.target.value 
      });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signin(formData);
       if (res.status === 200) {
        // ✅ STORE ALL REQUIRED DATA
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);
        localStorage.setItem("username", res.data.user.username || "");

        alert("Sign In Successful");

        // ✅ If username exists → go to chat
        // ❌ If not → go to username page
        if (res.data.user.username) {
          navigate("/chat");
        } else {
          navigate("/UserName");
        }
      }
    } catch (error) {
      console.error("SignIn error:", error);
      setError(error.response?.data?.message || "Sign In failed");
      alert("Sign In Failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Top Navigation */}
      <div className="flex justify-between items-center px-6 md:px-10 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm">
            Logo
          </div>
          <h1 className="text-lg font-medium text-gray-800 tracking-wide">
            CHIT-CHAT
          </h1>
        </div>
        <button onClick={() => navigate ("/")} className="backdrop-blur-xl bg-white/60 border border-gray-800 text-gray-800 px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition">
          SIGN UP
        </button>
      </div>

      {/* Main Content */}
      <div className="flex justify-center rounded-xl">
        <div className="bg-[#FAF8F5] backdrop-blur-xl bg-white/50 shadow-md rounded-xl px-20 py-12">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 font-[Zen Kaku Gothic Antique]">
            Log in to Chit-Chat
          </h2>
          <p className="text-center text-gray-500 text-sm mt-1 mb-6">WELCOME</p>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-xs text-gray-600 mb-1">
              Email Address
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="johndoe@example.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="***********"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <span className="absolute right-3 top-2.5 text-gray-400 cursor-pointer select-none" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? (
                  <FaEyeSlash size={20} className="text-black hover:text-gray-500 cursor-pointer" />
                ) : (
                  <FaEye size={20} className="text-black hover:text-gray-500 cursor-pointer" />
                )}
              </span>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 text-xs gap-2">
            <label className="flex items-center space-x-1">
              <input type="checkbox" defaultChecked className="accent-emerald-500" />
              <span className="text-gray-600">Remember Me</span>
            </label>
            <a href="#" className="text-emerald-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button onClick={handleSubmit} className="w-full bg-[#1F2B44] text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
            {loading ? 'Signing in...' : 'LOGIN'}
          </button>

          {/* Divider */}
          <div className="text-center text-sm text-gray-500 my-6">
            or continue with
          </div>

          {/* Social Login Buttons */}
        <div className="flex justify-center space-x-4 sm:space-x-6">
          <button className="p-2 border border-gray-300 rounded-md hover:shadow-md bg-white">
            <FcGoogle size={22} />
          </button>
          <button className="p-2 border border-gray-300 rounded-md hover:shadow-md bg-white">
            <FaApple size={22} />
          </button>
          <button className="p-2 border border-gray-300 rounded-md hover:shadow-md text-blue-600 bg-white">
            <FaFacebook size={22} />
          </button>
        </div>
        </div>
      </div>
          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-10">
            © 2025 All Rights Reserved. Chit-Chat
          </p>
        
      
    </div>
  );
}
export default SignIn;