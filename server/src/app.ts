import express from "express";
import cors from "cors"
import errorMiddleware from "./middlewares/error.middleware";
import { env } from "./config/env";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes"
import requestRoutes from "./routes/request.routes"
import responseRoutes from "./routes/response.routes"
import widgetRoutes from "./routes/widget.routes";
import userRoutes from "./routes/user.routes"
import dashboardRoutes from "./routes/dashboard.routes"
import { globalLimiter } from "./middlewares/rateLimit.middleware";

const app = express();

app.set("trust proxy", 1)

const allowedOrigins = [
    env.CLIENT_URL,
    "http://localhost:5173"
]
app.use(cors({
    origin:env.NODE_ENV==="production"? env.CLIENT_URL:"http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(cookieParser())
app.use("/api",globalLimiter)

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Speakwell API is running",
        version:"1.0.0"
    })
})

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "healthy",
        timestamp:new Date().toISOString()
    })
})
app.use("/api/auth", authRoutes)
app.use("/api/requests", requestRoutes)
app.use("/api/responses", responseRoutes)
app.use("/api/widget", widgetRoutes)
app.use("/api/users", userRoutes)
app.use("/api/dashboard",dashboardRoutes)
app.use("/{*splat}", (_req, res) => {
    res.status(404).json({
        success: false,
        message:"Route not found"
    })
})

app.use(errorMiddleware)

export default app