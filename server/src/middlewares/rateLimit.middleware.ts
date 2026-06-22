import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { success } from "zod";

const rateLimitHandler = (req: Request, res: Response) => {
    res.status(429).json({
        success: false,
        message:"Too many requests. Please try again later"
    })
}


export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    skipSuccessfulRequests:false
})


export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler:rateLimitHandler
})


export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 60,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler:rateLimitHandler
})

export const submitResponseLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler:rateLimitHandler
})


export const llmLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler:rateLimitHandler
})

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler:rateLimitHandler
})