import jwt from "jsonwebtoken"
import { env } from "../config/env"

export const generateAccessToken = (userId: string):string => {
    return jwt.sign(
        { userId },
        env.JWT_ACCESS_TOKEN_SECRET,
        {
            expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN 
        } as jwt.SignOptions
    )
}