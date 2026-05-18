import { NextFunction, Request, Response } from "express";
import { error } from "node:console";

const errorMiddleware = (
    error: any,
    _req: Request,
    res: Response,
    _next:NextFunction
) => {
    const statusCode = error.statusCode || 500;

    const message = error.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message
    })
}

export default errorMiddleware;