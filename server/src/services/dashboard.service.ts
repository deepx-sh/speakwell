import mongoose from "mongoose";
import TestimonialRequest from "../models/testimonialRequest.model";
import TestimonialResponse from "../models/testimonialResponse.model";
import AppError from "../utils/AppError";


export const getDashboardStatsService = async (ownerId: string) => {
    const requestIds = await TestimonialRequest.find({
        owner: ownerId,
    }).distinct("_id")

    if (requestIds.length === 0) {
        return {
            totalRequests: 0,
            activeRequests: 0,
            totalSubmissions: 0,
            pendingReview: 0,
            approved: 0,
            rejected: 0,
            published: 0,
            averageRating:0
        }
    }

    const [
        totalRequests,
        activeRequests,
        totalSubmissions,
        pendingReview,
        approved,
        rejected,
        published,
        ratingAgg,
    ] = await Promise.all([
        TestimonialRequest.countDocuments({ owner: ownerId }),
        
        TestimonialRequest.countDocuments({
            owner: ownerId,
            status:"ACTIVE"
        }),

        TestimonialResponse.countDocuments({
            request:{$in:requestIds}
        }),

        TestimonialResponse.countDocuments({
            request: { $in: requestIds },
            status:"PENDING"
        }),

        TestimonialResponse.countDocuments({
            request: { $in: requestIds },
            status:"APPROVED"
        }),

        TestimonialResponse.countDocuments({
            request: { $in: requestIds },
            status:"REJECTED"
        }),

        TestimonialResponse.countDocuments({
            request: { $in: requestIds },
            isPublished: true,
            status:"APPROVED"
        }),

        TestimonialResponse.aggregate([
            { $match: { request: { $in: requestIds } } },
            {$group:{_id:null,avg:{$avg:"$rating"}}}
        ])
    ])

    const averageRating = ratingAgg[0]?.avg ? parseFloat(ratingAgg[0].avg.toFixed(1)) : 0;

    return {
        totalRequests,
        activeRequests,
        totalSubmissions,
        pendingReview,
        approved,
        rejected,
        published,
        averageRating
    }
}


export const getDashboardTestimonialService = async(
    ownerId: string,
    query: {
        status?: "PENDING" | "APPROVED" | "REJECTED";
        isPublished?: boolean;
        requestId?: string;
        page?: number;
        limit?: number;
        sortBy?: "createdAt" | "rating",
        order?:"asc"| "desc"
    }
) => {
    const {
        status,
        isPublished,
        requestId,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc"
    } = query;

    let requestIds : mongoose.Types.ObjectId[];
    
    if (requestId) {
        
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            throw new AppError("Invalid request ID",400)
        }

        const request = await TestimonialRequest.findOne({
            _id: requestId,
            owner:ownerId
        })

        if (!request) throw new AppError("Request not found", 404)
        
        requestIds=[new mongoose.Types.ObjectId(requestId)]
    } else {
        requestIds = await TestimonialRequest.find({
            owner:ownerId
        }).distinct("_id")
    }

    const filter: Record<string, unknown> = {
        request:{$in:requestIds}
    }

    if (status) filter.status = status;
    if (isPublished !== undefined) filter.isPublished = isPublished;

    const sortOrder = order === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
        TestimonialResponse.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate({
                path: "request",
                select:"title token status"
            })
            .select("-__v")
            .lean(),
        
        TestimonialResponse.countDocuments(filter)
    ])

    return {
        testimonials,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage:page>1
        }
    }
}

export const getRecentActivityService = async (ownerId: string) => {
    const requestIds = await TestimonialRequest.find({
        owner: ownerId
    }).distinct("_id");

    const recent = await TestimonialResponse.find({
        request:{$in:requestIds}
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
            path: "request",
            select:"title token"
        })
        .select("clientName rating status isPublished createdAt request")
        .lean()
    
    return recent
}