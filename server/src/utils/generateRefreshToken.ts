import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        env.JWT_REFRESH_TOKEN_SECRET,
        {
            expiresIn:env.JWT_REFRESH_TOKEN_EXPIRES_IN
        } as jwt.SignOptions
    )
}