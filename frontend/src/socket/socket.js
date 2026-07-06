import { io } from "socket.io-client";

// const socket = io("https://chit-chat-2-i63p.onrender.com", {
//   withCredentials: true,
//   transports: ["websocket"],
//   reconnection: true,
//   reconnectionAttempts: Infinity,
//   reconnectionDelay: 1000,
//   reconnectionDelayMax: 5000,
// });
const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

let activeUserId = null;

export const setSocketUser = (userId) => {
  const normalizedUserId = userId ? String(userId) : "";
  activeUserId = normalizedUserId;

  if (!normalizedUserId) return;

  if (socket.connected) {
    socket.emit("user-online", normalizedUserId);
    console.log("🟢 Marked user online:", normalizedUserId, socket.id);
  }
};

socket.on("connect", () => {
  if (activeUserId) {
    socket.emit("user-online", activeUserId);
    console.log("🟢 Reconnected user-online:", activeUserId, socket.id);
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

window.addEventListener("beforeunload", () => {
  if (socket.connected) {
    socket.disconnect();
  }
});

export default socket;