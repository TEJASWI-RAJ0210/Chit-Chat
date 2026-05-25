import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import bg from "../assets/SignUp_bg.png";
import { useNavigate } from "react-router-dom";
import SignIn from "./SignIn.jsx";
import { useState } from "react";
import { signup} from "../API.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";



const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signup(formData);
      localStorage.setItem("token", res.data.token);

      if (res.status === 201) {
        // ✅ SAVE userId for username page
        localStorage.setItem("userId", res.data.userId);

        alert("Sign Up Successful");
        navigate("/UserName");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.response?.data?.message || "Signup failed");
      alert("Sign Up Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative px-4"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* SIGN IN button */}

      <button
        type="button"
        onClick={() => navigate("/SignIn")}
        className="backdrop-blur-xl bg-white/60 border border-gray-800 text-gray-800 px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition absolute top-6 bg-[#FAF8F54D] right-10 border-[1.5px] border-[#1F2B44] px-5 py-2 rounded-md text-base transition-all w-[136px] h-[48]"
      >
        SIGN IN
      </button>

      {/* Logo */}
      <div className="absolute top-8 left-10 flex items-center space-x-2">
        <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm">
            Logo
          </div>
         <h1 className="text-lg font-medium text-gray-800 tracking-wide">CHIT-CHAT</h1>
      </div>

      {/* Card */}
     <div className="flex justify-center rounded-xl">
        <div className="bg-[#FAF8F5] backdrop-blur-xl bg-white/50 shadow-md rounded-xl px-20 py-12">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 font-[Zen Kaku Gothic Antique]">
          Sign up to Chit-Chat
        </h2>
        <p className="text-[#757575] mb-8 text-sm">
         
        </p>

        {/* Input Fields */}
        <div className="text-left space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

         <div className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="*****"
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

        {/* Checkbox */}
        <div className="flex items-start mb-6 text-left">
          <input
            type="checkbox"
            className="mt-1 mr-2 accent-orange-500"
            defaultChecked
          />
          <p className="text-xs text-gray-600 leading-snug">
            I agree to the{" "}
            <span className="text-blue-600">Terms of Service</span> and{" "}
            <span className="text-blue-600">Privacy Policy</span>.
          </p>
        </div>

        {/* Create Account */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#101828] text-white py-3 rounded-md font-semibold hover:bg-[#2d3648] transition-all mb-4 text-sm"
        >
          {loading ? "Creating Account..." : "CREATE AN ACCOUNT"}
        </button>

        {error && (
          <p className="text-red-500 text-xs mb-4">{error}</p>
        )}

        <p className="text-xs text-gray-600 mb-4">or continue with</p>

        {/* Social Icons */}
        <div className="flex justify-center space-x-5">
          <button className="bg-[#EEEEEE] p-2 border border-gray-300 rounded-md hover:shadow-md">
            <FcGoogle size={22} />
          </button>
          <button className="bg-[#EEEEEE] p-2 border border-gray-300 rounded-md hover:shadow-md">
            <FaApple size={22} />
          </button>
          <button className="bg-[#EEEEEE] p-2 border border-gray-300 rounded-md hover:shadow-md text-blue-600">
            <FaFacebook size={22} />
          </button>
        </div>
      </div>

      {/* Footer */}
     <p className="text-center text-xs text-gray-500 mt-10">
        © 2025 All Rights Reserved, Chit-Chat
      </p>
    </div>
    </div>
    </div>
  );
};
export default SignUp;