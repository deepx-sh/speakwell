import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { apiResponse } from "../utils/apiResponse";
import { registerService, loginService, logoutService, verifyEmailService, resetPasswordService, forgotPasswordService, resendOtpService } from "../services/auth.service";
import { clearAuthCookie, setAuthCookie } from "../utils/setAuthCookies";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { env } from "../config/env";
import { generateRefreshToken } from "../utils/generateRefreshToken";
import AppError from "../utils/AppError";
import { generateAccessToken } from "../utils/generateAccessToken";


export const registerController = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    await registerService(name, email, password);

    return res.status(201).json(apiResponse({success:true,message:"Verification OTP sent to your email"}))
})

export const verifyEmailController = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const { user, accessToken, refreshToken } = await verifyEmailService(email, otp);

    setAuthCookie(res, accessToken,refreshToken);

    return res.status(201).json(
        apiResponse({
            success: true,
            message: "Email verified successfully",
            data: 
                user,
            
        })
    )
})

export const loginController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await loginService(email, password);

    setAuthCookie(res, accessToken, refreshToken)
    
    return res.status(200).json(
        apiResponse({
            success: true,
            message: "Login successful",
            data: {
                user
            }
        })
    )
})

export const forgotPasswordController = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await forgotPasswordService(email);

    return res.status(200).json(
        apiResponse({
            success: true,
            message:"If this email is registered you will receive a reset OTP shortly"
        })
    )
})

export const resetPasswordController = asyncHandler(async (req: Request, res: Response) => {
    const { token,newPassword } = req.body;

    await resetPasswordService(token ,newPassword);

    return res.status(200).json(
        apiResponse({
            success: true,
            message:"Password reset successful. Pleasse login with your new password"
        })
    )
})

export const refreshTokenController = asyncHandler(async (req: Request, res: Response,next:NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return next(new AppError("Refresh token missing",401))
    }

    let decoded;
   try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_TOKEN_SECRET) as { userId: string }
   } catch (error) {
        return next(new AppError("Invalid or expired token",401))
   }
        
    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user) {
        return next(new AppError("User no longer exists",401))
    }

    if (user.refreshToken !== refreshToken) {
        await User.findByIdAndUpdate(decoded.userId, { refreshToken: null });
        return next(new AppError("Invalid refresh token",401))
    }

    if (!user.isVerified) {
        return next(new AppError("Please verify your email first",403))
    }
   

    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    await User.findByIdAndUpdate(user._id, {
        refreshToken:newRefreshToken
    })

    setAuthCookie(res, newAccessToken, newRefreshToken);

    return res.status(200).json(
        apiResponse({
            success: true,
            message:"Token refreshed successfully"
        })
    )
})


export const logoutController = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
        const user = await User.findOne({
            refreshToken
        })

        if (user) {
            user.refreshToken = null;
            await user.save()
        }
    }

    clearAuthCookie(res);

    return res.status(200).json(
        apiResponse({
            success: true,
            message:"Logout successfully"
        })
    )
})

export const resendOtpController = asyncHandler(async (req: Request, res: Response) => {
    const { email, type } = req.body;

    await resendOtpService(email, type);

    return res.status(200).json(
        apiResponse({
            success: true,
            message:"If a pending OTP exists for this email it will be resent"
        })
    )
})