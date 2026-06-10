import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { app } from "./app.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

/* ------------------ SERVER ------------------ */
const server = http.createServer(app);

/* ------------------ CORS ------------------ */
app.use(cors({
  origin: "http://localhost:5173", // ⚠️ DO NOT USE "*"
  credentials: true
}));

app.use(express.json());

/* ------------------ ROUTES ------------------ */
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

/* ------------------ SOCKET.IO ------------------ */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

app.set('io', io);

/* ✅ GLOBAL (IMPORTANT) */
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  /* User online */
  socket.on("user-online", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  /* Join chat room */
  socket.on("joinChat", (chatID) => {
    socket.join(chatID);
    console.log(`User joined chat ${chatID}`);
  });

 
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

export {io};
/* ------------------ START ------------------ */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});