import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import bg2 from "../assets/bg2.png";
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
      if (res?.status === 200 || res?.status === 201) {
        localStorage.setItem("token", res.data.token);
        alert("Sign In Successful");
        navigate("/UserName");
      } else {
        throw new Error(res?.data?.message || 'Sign in failed');
      }
    } catch (error) {
      console.error('SignIn error:', error);
      setError(error.message || 'Sign In failed');
      alert("Sign In Failed. Please check your credentials. " + (error.message || ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative" style={{ backgroundImage: `url(${bg2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
          <p className="text-center text-gray-500 text-sm mt-1 mb-6">add desc</p>

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
                type="password"
                placeholder="***********"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <span className="absolute right-3 top-2.5 text-gray-400 cursor-pointer select-none">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="16" height="16">
                <path d="M288 80C222.8 80 169.2 109.6 128.1 147.7 89.6 183.5 63 226 49.4 256 63 286 89.6 328.5 128.1 364.3 169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256 513 226 486.4 183.5 447.9 147.7 406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1 3.3 7.9 3.3 16.7 0 24.6-14.9 35.7-46.2 87.7-93 131.1-47.1 43.7-111.8 80.6-192.6 80.6S142.5 443.2 95.4 399.4c-46.8-43.5-78.1-95.4-93-131.1-3.3-7.9-3.3-16.7 0-24.6 14.9-35.7 46.2-87.7 93-131.1zM288 336c44.2 0 80-35.8 80-80 0-29.6-16.1-55.5-40-69.3-1.4 59.7-49.6 107.9-109.3 109.3 13.8 23.9 39.7 40 69.3 40zm-79.6-88.4c2.5 .3 5 .4 7.6 .4 35.3 0 64-28.7 64-64 0-2.6-.2-5.1-.4-7.6-37.4 3.9-67.2 33.7-71.1 71.1zm45.6-115c10.8-3 22.2-4.5 33.9-4.5 8.8 0 17.5 .9 25.8 2.6 .3 .1 .5 .1 .8 .2 57.9 12.2 101.4 63.7 101.4 125.2 0 70.7-57.3 128-128 128-61.6 0-113-43.5-125.2-101.4-1.8-8.6-2.8-17.5-2.8-26.6 0-11 1.4-21.8 4-32 .2-.7 .3-1.3 .5-1.9 11.9-43.4 46.1-77.6 89.5-89.5z"/></svg>
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