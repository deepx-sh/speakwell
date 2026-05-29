import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { apiResponse } from "../utils/apiResponse";
import { createRequestService, closeRequestService, deleteRequestService, getRequestByIdService, getRequestByTokenService, getRequestsByOwnerService, updateRequestService } from "../services/request.service";

export const createRequestController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();
        const { title, questions, theme, allowAnonymous, expiresAt } = req.body;

        const request = await createRequestService(ownerId, {
            title,
            questions,
            theme,
            allowAnonymous,
            expiresAt
        })

        return res.status(201).json(
            apiResponse({
                success: true,
                message: "Testimonial request created successfully",
                data:request
            })
        )
    }
)

export const getRequestsByOwnerController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId= req.user._id.toString();
    
        const requests = await getRequestsByOwnerService(ownerId);

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Requests fetched successfully",
                data:requests
            })
        )
    }
)

export const getRequestByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();
        const { id } = req.params;

        if (typeof id !== "string") {
            throw new Error("Invalid request ID")
        }

        const request = await getRequestByIdService(id, ownerId);

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Request fetched successfully",
                data:request
            })
        )
    }
)

export const getRequestByTokenController = asyncHandler(
    async (req: Request, res: Response) => {
        const { token } = req.params;

        if (typeof token !== "string") {
            throw new Error("Invalid token ID")
        }
        const request = await getRequestByTokenService(token);

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Request fetched successfully",
                data:request,
            })
        )

    }
)

export const updateRequestController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();
        const { id } = req.params;
        const { title, questions, theme, allowAnonymous, expiresAt } = req.body;

        if (typeof id !== "string") {
            throw new Error("Invalid request ID")
        }

        const request = await updateRequestService(id, ownerId, {
            title,
            questions,
            theme,
            allowAnonymous,
            expiresAt
        })

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Request updated successfully",
                data:request
            })
        )
    }
)

export const closeRequestController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();
        const { id } = req.params;

        if (typeof id !== "string") {
            throw new Error("Invalid request ID")
        }


        const request = await closeRequestService(id, ownerId)
        
        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Request closed successfully",
                data:request
            })
        )
    }
)

export const deleteRequestController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();
        const { id } = req.params;

        if (typeof id !== "string") {
            throw new Error("Invalid request ID")
        }

        await deleteRequestService(id, ownerId)

        return res.status(200).json(
            apiResponse({
                success: true,
                message:"Request deleted successfully"
            })
        )
    }
)

