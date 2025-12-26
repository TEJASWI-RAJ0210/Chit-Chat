import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/Auth.route.js"
import userRoutes from "./routes/user.route.js"
import friendRoutes from "./routes/friend.route.js"

const app= express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())


app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/friends', friendRoutes);


export { app}