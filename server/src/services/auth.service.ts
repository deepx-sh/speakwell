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