import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import friendRoutes from "./routes/friend.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import messageRoutes from "./routes/message.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import uploadRoutes from './routes/upload.routes.js';

import fs from 'fs';
if (!fs.existsSync('./public/temp')) {
  fs.mkdirSync('./public/temp', { recursive: true });
}

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

app.use(cookieParser())


app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);


export { app }
