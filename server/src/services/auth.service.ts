import bcrypt from "bcryptjs";
import User from "../models/user.model";
import OtpVerification from "../models/otpVerification.model";
import AppError from "../utils/AppError";
import { generateOtp, generateOtpExpire } from "../utils/generateOtp";
import { sendEmail } from "./email.service";
import { verificationEmailTemplate } from "../templates/verificationEmail.template";
import { resetPasswordEmailTemplate } from "../templates/resetPasswordEmail.template";
import { generateAccessToken } from "../utils/generateAccessToken";
import { generateRefreshToken } from "../utils/generateRefreshToken";
import mongoose from "mongoose";


export const registerService = async (name: string, email: string, password: string) => {
    const existingUser = await User.findOne({
        email,
    })

    if (existingUser) {
        throw new AppError("Email already registered",409)
    }

    await OtpVerification.deleteMany({
        email,
        type:"VERIFY_EMAIL"
    })

    const hashedPassword = await bcrypt.hash(password, 12);

    const rawOtp = generateOtp()
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    await OtpVerification.create({
        email,
        otp: hashedOtp,
        type: "VERIFY_EMAIL",
        tempUserData: {
            name,
            email,
            hashedPassword
        },
        expiresAt:generateOtpExpire(10)
    })

    await sendEmail({
        to: email,
        subject: "Verify your Speakwell account",
        htmlContent:verificationEmailTemplate(rawOtp)
    })
}


export const verifyEmailService = async (email: string, otp: string) => {
   
    const otpDoc = await OtpVerification.findOne({
        email,
        type:"VERIFY_EMAIL"
    })

    if (!otpDoc) {
        throw new AppError("OTP not found or already used",404)
    }

    if (otpDoc.expiresAt < new Date()) {
        throw new AppError("OTP has expired. Please request a new one", 410);
    }

    const isValid = await bcrypt.compare(otp, otpDoc.otp);

    if (!isValid) {
        throw new AppError("Invalid OTP",400)
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        await otpDoc.deleteOne();
        throw new AppError("Email already registered",409)
    }

    const tempUserId = new mongoose.Types.ObjectId();
    const accessToken = generateAccessToken(tempUserId.toString());
    const refreshToken = generateRefreshToken(tempUserId.toString());

    const user = new User({
        _id:tempUserId,
        name: otpDoc.tempUserData!.name,
        email: otpDoc.tempUserData!.email,
        password: otpDoc.tempUserData!.hashedPassword,
        isVerified: true,
        refreshToken,
        lastLogin:new Date()
    })

    await user.save();

    await otpDoc.deleteOne();

    return {
        user,
        accessToken,
        refreshToken
    }
}


export const loginService = async (email: string, password: string) => {
    const user = await User.findOne({ email }).select("+password +refreshToke");

    if (!user) {
        throw new AppError("Invalid credentials", 409);
    }

    if (!user.isVerified) {
        throw new AppError("Email is not verified. Please verify your email first",403)
    }

    if(!user.password){
        throw new AppError("Invalid credentials",401)
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new AppError("Invalid credntials", 401);
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    await User.findByIdAndUpdate(user._id, {
        refreshToken,
        lastLogin:new Date()
    })

    user.password = undefined as any;
    user.refreshToken = undefined as any;

    return {
        user,
        accessToken,
        refreshToken
    }
}

export const logoutService = async (userId: string, refreshToken: string)=>{
    const user = await User.findById(userId).select("+refreshToken")
    
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.refreshToken !== refreshToken) {
        throw new AppError("Invalid session",401)
    }

    await User.findByIdAndUpdate(userId, {
        refreshToken:null
    })
}

export const forgotPasswordService = async (email: string) => {
    const user=await User.findOne({email});

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (!user.isVerified) {
        throw new AppError("Email is not verified. Please verify your email first",403)
    }

    await OtpVerification.deleteMany({
        email,
        type:"RESET_PASSWORD"
    })

    const rawOtp = generateOtp();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);


    await OtpVerification.create({
        email,
        otp: hashedOtp,
        type:"RESET_PASSWORD",
        expiresAt:generateOtpExpire(10)
    })

    await sendEmail({
        to: email,
        subject: "Reset your Speakwell passwored",
        htmlContent:resetPasswordEmailTemplate(rawOtp)
    })
}


export const resetPasswordService = async (email: string, otp: string, newPassword: string) => {
    const otpDoc = await OtpVerification.findOne({
        email,
        type:"RESET_PASSWORD"
    })

    if (!otpDoc) {
        throw new AppError("Invalid or expired OTP",400)
    }

    if (otpDoc.expiresAt < new Date()) {
        await otpDoc.deleteOne();
        throw new AppError("OTP has expired. Please request a new one", 410)
    }

    const isValidOtp = await bcrypt.compare(otp, otpDoc.otp);
    if (!isValidOtp) {
        throw new AppError("Invalid OTP",400)
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found",404)
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await User.findOneAndUpdate(
        { email },
        {
            password: hashedPassword,
            refreshToken:null
        }
    )

    await otpDoc.deleteOne();
}