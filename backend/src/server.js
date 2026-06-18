import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { app } from "./app.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import User from "./src/models/user.model.js";
import fs from "fs";

dotenv.config();

// Ensure temp upload dir exists
if (!fs.existsSync("./public/temp")) {
  fs.mkdirSync("./public/temp", { recursive: true });
}

/* ── Server ── */
const server = http.createServer(app);

/* ── CORS ── */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

/* ── Routes ── */
app.use("/api/chat",     chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload",   uploadRoutes);

/* ── Socket.IO ── */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

// Global online users map: userId → socketId
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  /* ── Register user as online ── */
  socket.on("user-online", (userId) => {
    onlineUsers.set(userId, socket.id);
    // Broadcast updated list to ALL clients
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`👤 User online: ${userId} (${socket.id})`);
  });

  /* ── ✅ NEW: Send current online list to whoever requests it ──
     This fixes the "late mount" bug — components that mount after
     the last broadcast can ask for the current list directly.     */
  socket.on("request-online-users", () => {
    // Emit only to the requesting socket, not everyone
    socket.emit("online-users", Array.from(onlineUsers.keys()));
  });

  /* ── Join a chat room ── */
  socket.on("joinChat", (chatID) => {
    socket.join(chatID);
    console.log(`Joined chat: ${chatID}`);
  });

  /* ── WebRTC signalling ── */
  socket.on("call-user", ({ targetUserId, callerId }) => {
    const targetSocketId = onlineUsers.get(targetUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming-call", { callerId });
    }
  });

  socket.on("offer", ({ targetUserId, offer }) => {
    const target = onlineUsers.get(targetUserId);
    if (target) io.to(target).emit("offer", offer);
  });

  socket.on("answer", ({ targetUserId, answer }) => {
    const target = onlineUsers.get(targetUserId);
    if (target) io.to(target).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ targetUserId, candidate }) => {
    const target = onlineUsers.get(targetUserId);
    if (target) io.to(target).emit("ice-candidate", candidate);
  });

  /* ── Disconnect ── */
  socket.on("disconnect", async () => {
    let disconnectedUserId = null;

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }

    // ✅ Save lastSeen timestamp so UserInfoCard can show it
    if (disconnectedUserId) {
      try {
        await User.findByIdAndUpdate(disconnectedUserId, {
          lastSeen: new Date(),
        });
      } catch (e) {
        console.error("Failed to update lastSeen:", e.message);
      }
    }

    // Broadcast updated online list to all remaining clients
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

export { io };

/* ── Start ── */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});