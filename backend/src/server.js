import "./env.js"; // Must be first
import connectDB from "./config/database.js";
import { app } from "./app.js"
import User from "./models/user.model.js";
import Chat from "./models/chat.model.js";
import jwt from "jsonwebtoken";

// dotenv.config calls removed as they are now in env.js
import http from "http";
import { Server } from "socket.io";
import { corsOptions } from "./config/cors.js";


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

/* ------------------ SOCKET.IO ------------------ */
const io = new Server(server, {
  cors: corsOptions
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));

  for (const secret of [process.env.JWT_SECRET, process.env.ACCESS_TOKEN_SECRET]) {
    if (!secret) continue;
    try {
      const decoded = jwt.verify(token, secret);
      const userId = decoded.userId || decoded._id || decoded.id;
      if (!userId) return next(new Error("Invalid authentication token"));
      socket.data.userId = String(userId);
      return next();
    } catch {
      // Try the next configured signing secret.
    }
  }
  return next(new Error("Invalid authentication token"));
});

/* ✅ GLOBAL (IMPORTANT) */
const onlineUsers = new Map();
const activeCalls = new Map();

const getPeerSocketIds = (userId) => onlineUsers.get(String(userId)) || new Set();
const emitToUser = (userId, event, payload) => {
  for (const socketId of getPeerSocketIds(userId)) io.to(socketId).emit(event, payload);
};
const isChatPeerPair = async (chatId, userId, peerId) => {
  if (!chatId || !userId || !peerId) return false;
  return Boolean(await Chat.exists({
    _id: chatId,
    participants: { $all: [userId, peerId] },
  }));
};

// expose io and shared user map to routes via the express app
app.set('io', io);
app.set('onlineUsers', onlineUsers);

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  const userId = socket.data.userId;
  const userSockets = onlineUsers.get(userId) || new Set();
  userSockets.add(socket.id);
  onlineUsers.set(userId, userSockets);
  io.emit("online-users", Array.from(onlineUsers.keys()));
  console.log(`👤 User online: ${userId} (${socket.id})`);

  socket.on("request-online-users", () => {
    socket.emit("online-users", Array.from(onlineUsers.keys()));
  });

  /* Join chat room */
  socket.on("joinChat", async (chatId) => {
    try {
      const isMember = await Chat.exists({ _id: chatId, participants: userId });
      if (!isMember) return;
      socket.join(String(chatId));
      console.log(`User ${userId} joined chat ${chatId}`);
    } catch (error) {
      console.error("Failed to join chat room:", error.message);
    }
  });

  socket.on("call-user", async ({ targetUserId, callId, chatId }) => {
    const peerId = String(targetUserId || "");
    try {
      if (!callId || peerId === userId || !(await isChatPeerPair(chatId, userId, peerId))) {
        return socket.emit("call-failed", { callId, reason: "invalid-chat" });
      }
      const peerSockets = getPeerSocketIds(peerId);
      if (peerSockets.size === 0) {
        return socket.emit("call-failed", { callId, reason: "offline" });
      }
      const call = { callerId: userId, calleeId: peerId, chatId: String(chatId), readyUsers: new Set() };
      const caller = await User.findById(userId).select("fullName username");
      activeCalls.set(String(callId), call);
      call.timeout = setTimeout(() => {
        if (activeCalls.get(String(callId)) !== call) return;
        activeCalls.delete(String(callId));
        emitToUser(userId, "call-failed", { callId, reason: "timeout" });
        emitToUser(peerId, "call-cancelled", { callId });
      }, 60_000);
      emitToUser(peerId, "incoming-call", {
        callerId: userId,
        callerName: caller?.fullName || caller?.username || "Someone",
        callId,
        chatId: String(chatId),
      });
    } catch (error) {
      console.error("Failed to start call:", error.message);
      socket.emit("call-failed", { callId, reason: "server-error" });
    }
  });

  socket.on("accept-call", ({ callerId, callId, chatId }) => {
    const call = activeCalls.get(String(callId));
    if (!call || call.callerId !== String(callerId) || call.calleeId !== userId || call.chatId !== String(chatId)) return;
    clearTimeout(call.timeout);
    call.accepted = true;
    emitToUser(call.callerId, "call-accepted", { receiverId: userId, callId, chatId: call.chatId });
  });

  socket.on("call-ready", ({ callId }) => {
    const call = activeCalls.get(String(callId));
    if (!call || !call.accepted || ![call.callerId, call.calleeId].includes(userId)) return;
    call.readyUsers.add(userId);
    if (call.readyUsers.size === 2) {
      emitToUser(call.callerId, "call-peer-ready", { callId });
      emitToUser(call.calleeId, "call-peer-ready", { callId });
    }
  });

  socket.on("reject-call", ({ callerId, callId }) => {
    const call = activeCalls.get(String(callId));
    if (!call || call.callerId !== String(callerId) || call.calleeId !== userId) return;
    clearTimeout(call.timeout);
    activeCalls.delete(String(callId));
    emitToUser(call.callerId, "call-rejected", { callId });
  });

  const relayCallSignal = async (event, payload, signalName) => {
    const callId = String(payload?.callId || "");
    const call = activeCalls.get(callId);
    if (!call || !call.accepted || ![call.callerId, call.calleeId].includes(userId)) return;
    const peerId = call.callerId === userId ? call.calleeId : call.callerId;
    try {
      if (!(await isChatPeerPair(call.chatId, userId, peerId))) return;
      emitToUser(peerId, event, { callId, [signalName]: payload[signalName] });
    } catch (error) {
      console.error("Failed to relay call signal:", error.message);
    }
  };

  socket.on("offer", (payload) => relayCallSignal("offer", payload, "offer"));
  socket.on("answer", (payload) => relayCallSignal("answer", payload, "answer"));
  socket.on("ice-candidate", (payload) => relayCallSignal("ice-candidate", payload, "candidate"));
  socket.on("end-call", ({ callId }) => {
    const call = activeCalls.get(String(callId));
    if (!call || ![call.callerId, call.calleeId].includes(userId)) return;
    clearTimeout(call.timeout);
    activeCalls.delete(String(callId));
    const peerId = call.callerId === userId ? call.calleeId : call.callerId;
    emitToUser(peerId, "call-ended", { callId });
  });

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
    for (const [connectedUserId, sockets] of onlineUsers.entries()) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(connectedUserId);
          disconnectedUserId = connectedUserId;
        } else {
          onlineUsers.set(connectedUserId, sockets);
        }
        break;
      }
    }

    if (disconnectedUserId) {
      for (const [callId, call] of activeCalls.entries()) {
        if (call.callerId !== disconnectedUserId && call.calleeId !== disconnectedUserId) continue;
        clearTimeout(call.timeout);
        activeCalls.delete(callId);
        const peerId = call.callerId === disconnectedUserId ? call.calleeId : call.callerId;
        emitToUser(peerId, "call-ended", { callId });
      }
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
