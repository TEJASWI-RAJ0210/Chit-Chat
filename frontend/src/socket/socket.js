import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL;

if (!socketUrl) {
  throw new Error("VITE_SOCKET_URL is missing. Set it in the frontend environment.");
}

const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: false,
  auth: { token: localStorage.getItem("token") || "" },
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});


export const setSocketUser = () => {
  const token = localStorage.getItem("token") || "";
  if (!token) return;

  if (socket.connected) {
    if (socket.auth?.token !== token) {
      socket.disconnect();
      socket.auth = { token };
      socket.connect();
    }
    return;
  }

  socket.auth = { token };
  socket.connect();
};

socket.on("connect", () => {
  socket.emit("request-online-users");
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
