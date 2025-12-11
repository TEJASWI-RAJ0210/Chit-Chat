import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import bg from "../assets/SignUp_bg.png";
import { useNavigate } from "react-router-dom";
import SignIn from "./SignIn.jsx";
import { useState } from "react";
import { signup} from "../API.js";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await signup(formData);
      console.log("Signup successful:", response);
      alert("Sign Up Successful");
      // Redirect or show success message
      if (response.status === 201) {
        navigate("/UserName");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "Signup failed");
      alert("Sign Up Failed. Please try again." + error.message);
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
        className="absolute top-6 bg-[#FAF8F54D] right-10 border-[1.5px] border-[#1F2B44] px-5 py-2 rounded-md text-base hover:bg-black hover:text-white transition-all w-[136px] h-[48]"
      >
        SIGN IN
      </button>

      {/* Logo */}
      <div className="absolute top-8 left-10 flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-base">
          CC
        </div>
        <span className="text-lg font-medium text-gray-800">Chit-Chat</span>
      </div>

      {/* Card */}
      <div className="bg-[#FAF8F5]/90 border-1px border-[#E0E0E0] p-10 rounded-[20px] shadow-md w-full max-w-[572px] h-[588px] text-center flex flex-col">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Sign up to Chit-Chat
        </h1>
        <p className="text-[#757575] mb-8 text-sm">
          Add app desc here tejaswi and family
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

          <div>
            <label className="block text-gray-700 mb-1 text-sm">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="**********"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
              <span className="absolute right-3 top-2.5 text-gray-400 cursor-pointer">
                👁️
              </span>
            </div>
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
      <p className="absolute bottom-4 text-[#616161] text-xs text-center w-full">
        © 2025 All Rights Reserved, Chit-Chat
      </p>
    </div>
  );
};
export default SignUp;