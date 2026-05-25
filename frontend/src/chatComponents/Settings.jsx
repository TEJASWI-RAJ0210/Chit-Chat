import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../API.js";
import Sidebar from "./sidebar.jsx";

// ─── Privacy content ──────────────────────────────────────────────────────────
const privacySections = [
  {
    title: "Data We Collect",
    icon: "🗂️",
    body: `ChitChat collects only what's necessary to run the service: your name, email address, username, and the messages you send. Profile pictures are stored securely via Cloudinary. We never sell your personal data to third parties.`,
  },
  {
    title: "End-to-End Messaging",
    icon: "🔒",
    body: `Messages sent between users travel over encrypted WebSocket connections (TLS). While messages are stored in our database to support chat history, access is restricted to the participants of each conversation.`,
  },
  {
    title: "Password Security",
    icon: "🛡️",
    body: `Your password is never stored in plain text. We use bcrypt with a salt factor of 10 to hash all passwords before saving them. Even our engineers cannot see your password.`,
  },
  {
    title: "Authentication Tokens",
    icon: "🪪",
    body: `ChitChat uses short-lived JWT access tokens paired with refresh tokens for session management. Tokens are stored in HTTP-only cookies where possible to reduce XSS exposure. Sessions expire automatically after inactivity.`,
  },
  {
    title: "Who Can See You",
    icon: "👁️",
    body: `Your online/offline status is visible to users you share a chat with. Your email address is never shown to other users. Your bio and profile picture are visible to your friends and anyone who searches for your username.`,
  },
  {
    title: "Data Deletion",
    icon: "🗑️",
    body: `You may request deletion of your account and all associated data at any time by contacting support. Upon deletion, your messages, profile, and media will be permanently removed from our servers within 30 days.`,
  },
  {
    title: "Third-Party Services",
    icon: "🔗",
    body: `ChitChat integrates with Cloudinary (media storage) and Groq API (AI responses). These services have their own privacy policies. AI chat messages may be processed by Groq's servers to generate responses; do not share sensitive personal information in AI conversations.`,
  },
  {
    title: "Contact & Concerns",
    icon: "✉️",
    body: `If you have questions or concerns about your privacy, reach out to us at privacy@chitchat.app. We aim to respond to all privacy-related inquiries within 48 hours.`,
  },
];

// ─── Avatar helper ─────────────────────────────────────────────────────────────
const getAvatar = (profilePic, userId) =>
  profilePic || `https://api.dicebear.com/7.x/thumbs/svg?seed=${userId || "default"}`;

// ─── Component ─────────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    contactNumber: "",
    bio: "",
    profilePic: "",
  });
  const [previewPic, setPreviewPic] = useState(null);
  const [picFile, setPicFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
  const fileRef = useRef();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch user
  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      try {
        const res = await api.get(`/user/${userId}`);
        setFormData({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          username: res.data.username || "",
          contactNumber: res.data.contactNumber || "",
          bio: res.data.bio || "",
          profilePic: res.data.profilePic || "",
        });
      } catch (e) {
        console.error("Fetch user failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPicFile(file);
    setPreviewPic(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // If you have Cloudinary set up, upload picFile here and get back a URL,
      // then include it as profilePic in the PUT body.
      await api.put(`/user/update/${userId}`, {
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        bio: formData.bio,
      });
      showToast("success", "Profile updated successfully!");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPreviewPic(null);
    setPicFile(null);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f1117] text-white text-sm">
        Loading settings…
      </div>
    );

  const avatarSrc = previewPic || getAvatar(formData.profilePic, userId);

  return (
    <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden font-['DM_Sans',sans-serif]">
      {/* Google font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');`}</style>

      {/* ── Sidebar (reused from Chat) ── */}
      <Sidebar />

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top bar */}
        <div className="shrink-0 px-10 pt-8 pb-0">
          <h1 className="text-2xl font-['Syne',sans-serif] font-700 tracking-tight text-white mb-1">
            Settings
          </h1>
          <p className="text-sm text-gray-400 mb-6">Manage your account and privacy</p>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/10">
            {["account", "privacy"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors relative ${
                  activeTab === tab
                    ? "text-[#00e5a0]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab === "account" ? "Account Settings" : "Privacy & Security"}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00e5a0] rounded-t" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-10 py-8">

          {/* ══ ACCOUNT TAB ══ */}
          {activeTab === "account" && (
            <form onSubmit={handleSave} className="max-w-2xl flex flex-col gap-7">

              {/* Profile picture */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current.click()}
                    className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center
                               opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white font-medium"
                  >
                    Change
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePicChange}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Profile Photo</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    JPG, PNG or WebP · max 5 MB
                  </p>
                  {previewPic && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-red-400 hover:text-red-300 mt-1 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <Divider />

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" />
                <Field label="Email" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="you@example.com" />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Username" name="username" value={formData.username} onChange={handleChange} disabled placeholder="@username" note="Cannot be changed" />
                <Field label="Phone Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="+91 00000 00000" />
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell people a little about yourself…"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                             placeholder-gray-600 outline-none focus:border-[#00e5a0]/50 focus:ring-1
                             focus:ring-[#00e5a0]/20 resize-none transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#00e5a0] text-[#0f1117] text-sm font-semibold rounded-xl
                             hover:bg-[#00c98d] transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="reset"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 text-sm text-gray-400
                             rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          )}

          {/* ══ PRIVACY TAB ══ */}
          {activeTab === "privacy" && (
            <div className="max-w-2xl flex flex-col gap-5">
              <p className="text-sm text-gray-400 leading-relaxed">
                Your privacy matters to us. Here's a plain-English explanation of how ChitChat
                handles your data and keeps your account secure.
              </p>

              {privacySections.map((s) => (
                <div
                  key={s.title}
                  className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5
                             hover:border-[#00e5a0]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{s.icon}</span>
                    <h3 className="text-sm font-semibold text-white font-['Syne',sans-serif]">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.body}</p>
                </div>
              ))}

              <p className="text-xs text-gray-600 mt-2">
                Last updated: May 2026 · ChitChat v1.0
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-medium shadow-xl
            transition-all ${
              toast.type === "success"
                ? "bg-[#00e5a0] text-[#0f1117]"
                : "bg-red-500 text-white"
            }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
};

// ─── Small helpers ─────────────────────────────────────────────────────────────
const Divider = () => <div className="border-t border-white/10" />;

const Field = ({ label, note, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
      {note && <span className="text-xs text-gray-600">{note}</span>}
    </div>
    <input
      {...props}
      className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                  placeholder-gray-600 outline-none transition-colors
                  ${props.disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "focus:border-[#00e5a0]/50 focus:ring-1 focus:ring-[#00e5a0]/20"
                  }`}
    />
  </div>
);

export default SettingsPage;