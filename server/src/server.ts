import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import mongoose from "mongoose";


process.on("uncaughtException", (error: Error) => {
    console.error("UNCAUGHT EXCEPTION SHUTTING DOWN...")
    console.error(error.name, error.message)
    process.exit(1)
})
const startServer = async () => {
    try {
        await connectDB();

        const server=app.listen(env.PORT, () => {
            console.log(`Server running on PORT ${env.PORT}`)
        })

        process.on("unhandledRejection", (error: Error) => {
            console.error("UNHANDLED REJECTION SHUTTING DOWN...")
            console.error(error.name, error.message)
            
            server.close(async () => {
                await mongoose.connection.close()
                process.exit(1)
            })
        })

        process.on("SIGTERM", () => {
            console.log("SIGTERM RECEIVED SHUTTING DOWN GREACEFULLY")
            server.close(async () => {
                await mongoose.connection.close()
                console.log("MongoDB connection closed")
                process.exit(0)
            })
        })
    } catch (error) {
        console.error("Server startup failed", error)
        process.exit(1);
    }
}

startServer();