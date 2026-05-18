import mongoose from "mongoose";
import { env } from "./env";


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGO_URI)
        
        console.log("MONGODB CONNECTED SUCCESSFULLY");
        
    } catch (error) {
        console.error("MONGODB CONNECTION FAILED", error)
        process.exit(1);
    }
}