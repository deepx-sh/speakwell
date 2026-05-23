import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateResetPasswordToken = (
    userId: string,
    email:string
) => {
    return jwt.sign(
        { userId, email },
        env.JWT_RESET_PASSWORD_TOKEN_SECRET,
        {
            expiresIn:env.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN
        } as jwt.SignOptions
    )
}