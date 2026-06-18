import "./env.js"; // Must be first
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import cors from "cors";
import authRouter from './routes/Auth.route.js';
import { app } from "./app.js"
import express from "express";

// dotenv.config calls removed as they are now in env.js
import http from "http";
import { Server } from "socket.io";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";


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
  origin: "https://chit-chat-9je3.vercel.app/", // ⚠️ DO NOT USE "*"
  credentials: true
}));

app.use(express.json());

/* ------------------ ROUTES ------------------ */
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

/* ------------------ SOCKET.IO ------------------ */
const io = new Server(server, {
  cors: {
    origin: "https://chit-chat-9je3.vercel.app/",
    credentials: true
  }
});

// expose io to routes via the express app
app.set('io', io);

/* ✅ GLOBAL (IMPORTANT) */
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  /* User online */
socket.on("user-online", (userId) => {
    onlineUsers.set(userId, socket.id);
   io.emit("online-users", Array.from(onlineUsers.keys()));
   console.log(`👤 User online: ${userId} (${socket.id})`);
  });

  socket.on("request-online-users", () => {
  socket.emit("online-users", Array.from(onlineUsers.keys()));
});

  /* Join chat room */
  socket.on("joinChat", (chatID) => {
    socket.join(chatID);
    console.log(`User joined chat ${chatID}`);
  });

  /* Send message */
  // socket.on("sendMessage", async ({ chatID, senderID, text }) => {
  //   const message = { chatID, senderID, text };

  //   io.to(chatID).emit("receiveMessage", message);
  // });

  /* Disconnect */
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
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
