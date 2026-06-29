import mongoose from "mongoose";
import TestimonialRequest from "../models/testimonialRequest.model";
import TestimonialResponse from "../models/testimonialResponse.model";
import WidgetSettings from "../models/widgetSettings.model";
import AppError from "../utils/AppError";

const getDefaultSettings = () => ({
    primaryColor: "#C96B3F",
    theme: "light",
    layout: "card",
    fontFamily: "inherit",
    borderRadius: "medium",
    showVerifiedBadge: true,
    showRating: true,
    showAvatar: true,
    showCompany: true,
    maxTestimonialsToShow:3,
})
export const getWidgetDataService = async (token: string) => {
    
    const request = await TestimonialRequest.findOne({ token })
        .select("_id owner status expiresAt title")
        .lean();
    
    if (!request) {
        throw new AppError("Invalid widget token", 404);
    }

    const settings = await WidgetSettings.findOne({ owner: request.owner })
        .select("-__v -createdAt -updatedAt")
        .lean()

    const testimonials = await TestimonialResponse.find({
        request: request._id,
        isPublished: true,
        status:"APPROVED"
    })
        .select("clientName clientCompany clientAvatar rating approvedTestimonial createdAt")
        .sort({ createdAt: -1 })
        .limit(settings?.maxTestimonialsToShow ?? 3)
        .lean()
    
    return {
        title: request.title,
        settings: settings ?? getDefaultSettings(),
        testimonials
    }
}

export const getWidgetSettingsService = async (ownerId: string) => {
    const settings = await WidgetSettings.findOne({ owner: ownerId })
        .select("-__v");
    
    if (!settings) {
        const defaultSettings = await WidgetSettings.create({ owner: ownerId });
        return defaultSettings;
    }

    return settings;
}

export const updateWidgetSettingsService = async (
    ownerId: string,
    data: Partial<{
        primaryColor: string,
        theme: "light" | "dark",
        layout: "card" | "carousel" | "list",
        fontFamily: "inherit" | "inter" | "serif",
        borderRadius: "none" | "small" | "medium" | "large",
        showVerifiedBadge: boolean;
        showRating: boolean;
        showAvatar: boolean;
        showCompany: boolean;
        maxTestimonialsToShow: number
    }>
) => {
    const settings = await WidgetSettings.findOneAndUpdate(
        { owner: ownerId },
        { ...data },
        {
            returnDocument: "after",
            upsert: true,
            runValidators: true
        }
    ).select("-__v");

    return settings;
}

export const getEmbedScriptService = async(
    token: string,
    ownerId:string
) => {
    const request = await TestimonialRequest.findOne({
        token,
        owner: ownerId
    }).select("_id token");

    if (!request) {
        throw new AppError("Request not found",404)
    }

    return token
}
