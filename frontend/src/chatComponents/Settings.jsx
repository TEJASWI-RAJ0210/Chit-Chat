import React, { useState,useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../API.js";
import {
  FiHome,
  FiGrid,
  FiBarChart2,
  FiBook,
  FiSettings,
} from "react-icons/fi";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    contactNumber: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${userId}`);

        setFormData({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          username: res.data.username || "",
          contactNumber: res.data.contactNumber || "",
          bio: res.data.bio || "",
        });
      } catch (error) {
        console.error("Failed to fetch settings data", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put(`/user/update/${userId}`, {
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        bio: formData.bio,
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) return;
    const form = new FormData();
    form.append("profilePic", selectedFile);

    try {
      const res = await api.put(`/user/upload-pic/${userId}`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // update local state/ display success, e.g.:
      console.log("new user:", res.data);
    } catch (err) {
      console.error("upload failed", err);
      alert("Could not upload picture");
    }
  };

  if (loading) return <p>Loading settings...</p>;


  return (
    <div className="flex bg-gradient-to-br from-[#ffd0aa] to-[#f3a57c] min-h-screen font-sans">

      {/* Sidebar */}
      <div className="w-20 bg-white flex flex-col items-center py-6 gap-6">
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
          Logo
        </div>

        <FiHome size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" onClick={() => navigate('/chat')}/>
        <FiGrid size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" />
        <FiBarChart2 size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" />
        <FiBook size={24} className="text-gray-400 hover:text-green-500 cursor-pointer" />
        <FiSettings size={24} className="text-green-500 cursor-pointer" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 max-w-[1200px] mx-auto">

        {/* Tabs */}
        <div className="flex gap-6 mb-8">
          <button
            className={`text-lg pb-2 ${
              activeTab === "account"
                ? "text-[#00B78D] border-b-2 border-[#00B78D] font-Manrope w-[197px] h-[36px]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("account")}
          >
            Account Settings
          </button>

          <button
            className={`text-lg pb-2 ${
              activeTab === "privacy"
                ? "text-green-500 border-b-2 border-green-500 font-Manrope w-[190px] h-[27px]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy and Security
          </button>
        </div>

        {/* Profile Picture Upload Section */}
        <h3 className="text-Manrope  mb-4 text-[#4C535F] w-[146px] h-[22px] top-[125px] left-[109px]">
          Your Profile Picture
        </h3>

        <div
          className="w-[130px] h-[132px] border border-dashed border-gray-400 rounded-xl 
            flex flex-col items-center justify-center cursor-pointer bg-white mb-6"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-3xl mb-1">+</div>
          <p className="text-[13px] text-gray-500 whitespace-nowrap">Upload your photo</p>
          {selectedFile && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="preview"
              className="absolute w-[130px] h-[132px] object-cover rounded-xl"
            />
          )}
        </div>

        <hr className="border-t-2 border-[#717B8C] mb-8" />

        {/* Form */}
        <form className="flex flex-col gap-6">

          {/* Row 1 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* FULL NAME */}
            <div className="flex flex-col flex-1">
              <label className="font-medium mb-1 text-[#4C535F] text-Manrope">Full name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-Manrope"
                placeholder="Please enter your full name"
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col flex-1">
              <label className="font-medium mb-1 text-[#4C535F] text-Manrope">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="p-3 border border-gray-300 rounded-lg text-Manrope"
                placeholder="Please enter your email"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* USERNAME */}
            <div className="flex flex-col flex-1">
              <label className="font-medium mb-1 text-[#4C535F] text-Manrope">Username</label>
              <input
                name="username"
                value={formData.username}
                disabled
                className="p-3 border border-gray-300 rounded-lg text-Manrope"
                placeholder="Please enter your username"
              />
            </div>

            {/* PHONE NUMBER */}
            <div className="flex flex-col flex-1">
              <label className="font-medium mb-1 text-[#4C535F] text-Manrope">Phone number</label>
              <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 text-Manrope">
                <span className="text-gray-700 text-Manrope">+1</span>
                <input
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="flex-1 p-3 border-none outline-none text-Manrope"
                  placeholder="Please enter your phone number"
                />
              </div>
            </div>
          </div>

          {/* BIO */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-[#4C535F] text-Manrope">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg h-32 resize-none text-Manrope"
              placeholder="Write your Bio here e.g your hobbies, interests ETC"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-6">
            <button
              onClick={handleSave}
              type="submit"
              className="w-[201px] h-[49px] bg-[#00B78D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#009f7b] text-Manrope"
            >
              Update Profile
            </button>

            <button type="reset" className="text-gray-600 font-medium">
              Reset
            </button>

            <button onClick={handleUploadPicture}>Upload</button>
          </div>

        </form>

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={e => {
            const file = e.target.files[0];
            setSelectedFile(file);
          }}
        />
        
      </div>
    </div>
  );
};

export default SettingsPage;