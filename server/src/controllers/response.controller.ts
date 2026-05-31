import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { apiResponse } from "../utils/apiResponse"

import { submitResponseService, getResponseByRequestService, getResponseByIdService, approveResponseService, rejectResponseService, togglePublishResponseService, deleteResponseService } from "../services/response.service"

export const submitResponseController = asyncHandler(
    async (req: Request, res: Response) => {
        const { token } = req.params;
        const { clientName, clientEmail, clientCompany, rating, answers, tone } = req.body;
        

        if (typeof token !== "string") {
            throw new Error("Invalid token")
        }
        const response = await submitResponseService(token, {
            clientName,
            clientEmail,
            clientCompany,
            rating,
            answers,
            tone
        })

        return res.status(201).json(
            apiResponse({
                success: true,
                message: "Testimonial submitted successfully. Thank you!",
                data:response
            })
        )
    }
)

export const getResponseByRequestController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();
        const { requestId } = req.params;

        if (typeof requestId !== "string") {
            throw new Error("Invalid Request ID")
        }
        const response = await getResponseByRequestService(requestId, ownerId);

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Response fetched successfully",
                data:response
            })
        )
    }
)

export const getResponseByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId= req.user._id.toString();
        const { id } = req.params;

        if (typeof id !== "string") {
            throw new Error("Invalid ID")
        }
        const response = await getResponseByIdService(id, ownerId);

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Response fetched successfully",
                data:response
            })
        )
    }
)

export const approveResponseController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();
        const { id } = req.params;
        const { approvedTestimonial } = req.body
        

        if (typeof id !== "string") {
            throw new Error("Invalid ID")
        }
        const response = await approveResponseService(id, ownerId, approvedTestimonial)
        
        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Testimonial approved successfully",
                data:response
            })
        )
    }
)

export const rejectResponseController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();
        const { id } = req.params;

         if (typeof id !== "string") {
            throw new Error("Invalid ID")
        }

        const response = await rejectResponseService(id, ownerId);

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Testimonial rejected",
                data:response
            })
        )
    }
)

export const togglePublishResponseController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();
        const { id } = req.params;

         if (typeof id !== "string") {
            throw new Error("Invalid ID")
        }

        const response = await togglePublishResponseService(id, ownerId);

        return res.status(200).json(
            apiResponse({
                success: true,
                message: response.isPublished ? "Testimonial published to embed widget" : "Testimonial ubpublished from embed widget",
                data:response
            })
        )
    }
)

export const deleteResponseController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId= req.user._id.toString();
        const { id } = req.params;

         if (typeof id !== "string") {
            throw new Error("Invalid ID")
        }

        await deleteResponseService(id, ownerId);

        return res.status(200).json(
            apiResponse({
                success: true,
                message:"Response deleted successfully"
            })
        )
    }
)