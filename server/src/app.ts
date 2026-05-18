import express from "express";
import cors from "cors"
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

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