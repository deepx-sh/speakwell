import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import AppError from "../utils/AppError";
import User from "../models/user.model";


export const protect = async(
    req: Request,
    res: Response,
    next:NextFunction
) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            return next(new AppError("Unauthorized access", 401));
        }

        const decoded = jwt.verify(
            token,
            env.JWT_ACCESS_TOKEN_SECRET
        ) as { userId: string }
        
        const user = await User.findById(decoded.userId);

        if (!user) {
            return next(new AppError("User no longer exist",401))
        }

        if (!user.isVerified) {
            return next(new AppError("Please verify you email first",403))
        }

        req.user = user
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired token",401))
    }
}