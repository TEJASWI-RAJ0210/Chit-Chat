import http from "http"
import { Server } from "socket.io"
import { app } from "./app.js"
import dotenv from "dotenv"

dotenv.config()

// Create HTTP server
const server = http.createServer(app)

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }
})

// Socket logic
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id)

  socket.on("joinChat", (chatID) => {
    socket.join(chatID)
    console.log(`User joined chat ${chatID}`)
  })

  socket.on("sendMessage", async ({ chatID, senderID, text }) => {
    // save to DB here (Message.create)
    const message = { chatID, senderID, text }

    // emit to that chat only
    io.to(chatID).emit("receiveMessage", message)
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
