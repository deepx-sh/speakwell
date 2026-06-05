import bcrypt from "bcryptjs";
import User from "../models/user.model";
import TestimonialRequest from "../models/testimonialRequest.model";
import TestimonialResponse from "../models/testimonialResponse.model";
import WidgetSettings from "../models/widgetSettings.model";
import OtpVerification from "../models/otpVerification.model";
import AppError from "../utils/AppError";

export const getMeService = async (userId: string) => {
    const user = await User.findById(userId).select("-__v");

    if (!user) {
        throw new AppError("User not found",404)
    }

    return user;
}

export const updateProfileService = async(
    userId: string,
    data: {
        name?: string;
        avatar?: string | null;
    }
) => {
    const updates = Object.fromEntries(
        Object.entries(data).filter(([_,v])=>v!==undefined)
    )

    if (Object.keys(updates).length === 0) {
        throw new AppError("No fields provided to update",400)
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { ...updates },
        { new: true, runValidators: true }
    ).select("-__v");

    if (!user) {
        throw new AppError("User not found",404)
    }

    return user;
}

export const changePasswordService = async(
    userId: string,
    currentPassword: string,
    newPassword:string
) => {
    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (!user.password) {
        throw new AppError("Invalid credentials",401)
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
        throw new AppError("Current password is incorrect", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await User.findByIdAndUpdate(userId, {
        password: hashedPassword,
        refreshToken:null
    })
}

export const deleteAccountService = async(
    userId: string,
    password:string
) => {
    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

     if (!user.password) {
        throw new AppError("Invalid credentials",401)
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError("Current password is incorrect", 401);
    }

    const requestIds=await TestimonialRequest.find({owner:userId}).distinct("_id")
    await Promise.all([
        User.findByIdAndDelete(userId),
        TestimonialRequest.deleteMany({ owner: userId }),
        TestimonialResponse.deleteMany({ request: { $in: requestIds } }),
        WidgetSettings.deleteOne({ owner: userId }),
        OtpVerification.deleteMany({email:user.email})
    ])
}