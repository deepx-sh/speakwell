import express from "express";
import cors from "cors"
import errorMiddleware from "./middlewares/error.middleware";
import { env } from "./config/env";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes"
import requestRoutes from "./routes/request.routes"
import responseRoutes from "./routes/response.routes"
const app = express();

app.use(cors({
    origin: env.CLIENT_URL,
    credentials:true
}));
app.use(express.json());
app.use(cookieParser())
app.get("/", (_req, res) => {
    res.send("Speakwell API is running");
})
app.use("/api/auth", authRoutes)
app.use("/api/requests", requestRoutes)
app.use("/api/responses",responseRoutes)
app.use("/{*splat}", (_req, res) => {
    res.status(404).json({
        success: false,
        message:"Route not found"
    })
})

app.use(errorMiddleware)

export default app