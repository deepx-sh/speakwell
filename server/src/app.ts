import express from "express";
import cors from "cors"
import errorMiddleware from "./middlewares/error.middleware";
import { env } from "./config/env";
import cookieParser from "cookie-parser";

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

app.use("*", (_req, res) => {
    res.status(404).json({
        success: false,
        message:"Route not found"
    })
})

app.use(errorMiddleware)

export default app