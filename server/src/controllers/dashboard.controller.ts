import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { apiResponse } from "../utils/apiResponse";

import { getDashboardStatsService, getDashboardTestimonialService, getRecentActivityService } from "../services/dashboard.service";


export const getDashboardStatsController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();

        const stats = await getDashboardStatsService(ownerId);

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Dashboard stats feched successfully",
                data:stats
            })
        )
    }
)

export const getDashboardTestimonialsController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();

        const {
            status,
            isPublished,
            requestId,
            page,
            limit,
            sortBy,
            order
        } = req.query as Record<string, string>
        
        const result = await getDashboardTestimonialService(ownerId, {
            ...(status && { status: status as "PENDING" | "APPROVED" | "REJECTED" }),
            ...(isPublished !== undefined && { isPublished: isPublished === "true" }),
            ...(requestId && { requestId }),
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            ...(sortBy && { sortBy: sortBy as "createdAt" | "rating" }),
            ...(order && {order: order as "asc" | "desc"})
        })

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Testimonials fetched successfully",
                data: result.testimonials,
                pagination:result.pagination
            })
        )
    }
)

export const getRecentActivityController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString()
        
        const activity = await getRecentActivityService(ownerId)
        
        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Recent activity fetched successfully",
                data:activity
            })
        )
    }
)