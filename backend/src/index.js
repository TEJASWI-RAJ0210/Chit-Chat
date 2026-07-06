import "./env.js"; // Must be first
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import cors from "cors";
import authRouter from './routes/Auth.route.js';
import { app } from "./app.js"
import express from "express";
import User from "./models/user.model.js";

// dotenv.config calls removed as they are now in env.js
import http from "http";
import { Server } from "socket.io";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";
import uploadRoutes from "./routes/uploadRoutes.js";


connectDB()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log("MONOGODB connection failed !!!", err);
    process.exit(1);
  })


/* ------------------ SERVER ------------------ */
const server = http.createServer(app);

/* ------------------ CORS ------------------ */
app.use(cors({
  origin: "https://chit-chat-9je3.vercel.app", // ⚠️ DO NOT USE "*"
  credentials: true
}));

app.use(express.json());

/* ------------------ ROUTES ------------------ */
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);

/* ------------------ SOCKET.IO ------------------ */
const io = new Server(server, {
  cors: {
    origin: "https://chit-chat-9je3.vercel.app",
    credentials: true
  }
});

/* ✅ GLOBAL (IMPORTANT) */
const onlineUsers = new Map();

// expose io and shared user map to routes via the express app
app.set('io', io);
app.set('onlineUsers', onlineUsers);

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  /* User online */
  socket.on("user-online", (userId) => {
    if (!userId) return;
    const userKey = String(userId);
    const sockets = onlineUsers.get(userKey) || new Set();
    sockets.add(socket.id);
    onlineUsers.set(userKey, sockets);
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`👤 User online: ${userKey} (${socket.id})`);
  });

  socket.on("request-online-users", () => {
    socket.emit("online-users", Array.from(onlineUsers.keys()));
  });

  /* Join chat room */
  socket.on("joinChat", (chatID) => {
    socket.join(chatID);
    console.log(`User joined chat ${chatID}`);
  });

  /* Typing indicator */
socket.on("typing", ({ targetUserId, senderName, chatID }) => {
  const targetSockets = onlineUsers.get(String(targetUserId));
  if (targetSockets) {
    targetSockets.forEach((socketId) => {
      io.to(socketId).emit("user-typing", { senderName, chatID });
    });
  }
});

socket.on("stop-typing", ({ targetUserId, chatID }) => {
  const targetSockets = onlineUsers.get(String(targetUserId));
  if (targetSockets) {
    targetSockets.forEach((socketId) => {
      io.to(socketId).emit("user-stop-typing", { chatID });
    });
  }
});

  /* Send message */
  // socket.on("sendMessage", async ({ chatID, senderID, text }) => {
  //   const message = { chatID, senderID, text };

  //   io.to(chatID).emit("receiveMessage", message);
  // });

  /* Disconnect */
  socket.on("disconnect", async () => {
    let disconnectedUserId = null;
    for (const [userId, sockets] of onlineUsers.entries()) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          disconnectedUserId = userId;
        } else {
          onlineUsers.set(userId, sockets);
        }
        break;
      }
    }

    if (disconnectedUserId) {
      try {
        await User.findByIdAndUpdate(disconnectedUserId, {
          lastSeen: new Date(),
        });
      } catch (e) {
        console.error("Failed to update lastSeen:", e.message);
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(" Socket disconnected:", socket.id);
  });
});

/* ------------------ START ------------------ */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
