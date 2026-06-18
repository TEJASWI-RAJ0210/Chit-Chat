import { io } from "socket.io-client";

const socket = io("https://chit-chat-2-i63p.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

// ✅ Emit user-online HERE — directly on the socket's connect event.
// This is independent of React lifecycle so it fires reliably on
// first connect AND every reconnect, before any component mounts.
socket.on("connect", () => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    socket.emit("user-online", userId);
    console.log("🟢 Emitted user-online:", userId, socket.id);
  }
});

// Expose socket to the window for debugging during development only
if (import.meta && import.meta.env && import.meta.env.DEV) window.socket = socket;

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connect error:", err.message);
});

export default socket;