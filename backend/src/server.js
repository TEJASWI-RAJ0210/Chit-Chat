import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { app } from "./app.js";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import User from "./models/user.model.js";
import fs from "fs";

dotenv.config();

if (!fs.existsSync("./public/temp")) {
  fs.mkdirSync("./public/temp", { recursive: true });
}

const server = http.createServer(app);

app.use(cors({
  origin: "https://chit-chat-9je3.vercel.app",
  credentials: true,
}));
app.use(express.json());

app.use("/api/chat",     chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload",   uploadRoutes);

const io = new Server(server, {
  cors: {
    origin: "https://chit-chat-9je3.vercel.app",
    credentials: true,
  },
});

app.set("io", io);

// Global online users map: userId (string) → socketId (string)
const onlineUsers = new Map();

// ✅ FIX 1: This was missing — without it, req.app.get('onlineUsers')
// in messageRoutes.js always returns undefined, silently skipping
// the direct-emit-to-participant logic for both receiveMessage and
// messages-seen events.
app.set("onlineUsers", onlineUsers);

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("user-online", (userId) => {
    onlineUsers.set(String(userId), socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`👤 User online: ${userId} (${socket.id})`);
  });

  socket.on("request-online-users", () => {
    socket.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("joinChat", (chatID) => {
    socket.join(String(chatID));
    console.log(`Joined chat: ${chatID}`);
  });

  socket.on("call-user", ({ targetUserId, callerId }) => {
    const targetSocketId = onlineUsers.get(String(targetUserId));
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming-call", { callerId, targetUserId });
    }
  });

  socket.on("accept-call", ({ callerId, receiverId }) => {
    const callerSocketId = onlineUsers.get(String(callerId));
    if (callerSocketId) {
      io.to(callerSocketId).emit("call-accepted", { receiverId });
    }
  });

  socket.on("offer", ({ targetUserId, offer }) => {
    const target = onlineUsers.get(String(targetUserId));
    if (target) io.to(target).emit("offer", offer);
  });

  socket.on("answer", ({ targetUserId, answer }) => {
    const target = onlineUsers.get(String(targetUserId));
    if (target) io.to(target).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ targetUserId, candidate }) => {
    const target = onlineUsers.get(String(targetUserId));
    if (target) io.to(target).emit("ice-candidate", candidate);
  });

  socket.on("disconnect", async () => {
    let disconnectedUserId = null;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    if (disconnectedUserId) {
      try {
        await User.findByIdAndUpdate(disconnectedUserId, { lastSeen: new Date() });
      } catch (e) {
        console.error("Failed to update lastSeen:", e.message);
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

export { io };

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});