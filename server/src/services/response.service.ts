import mongoose from "mongoose";
import TestimonialRequest from "../models/testimonialRequest.model";
import TestimonialResponse, { IAnswer } from "../models/testimonialResponse.model";
import AppError from "../utils/AppError";
import { generateTestimonial } from "./llm.service";
import { uploadImageToCloudinary } from "../utils/cloudinaryUpload";


type PopulatedRequest = {
    owner: mongoose.Types.ObjectId;
    title: string;
}

interface ISubmitResponseData{
    clientName: string;
    clientEmail?: string | null;
    clientCompany?: string | null;
    rating: number;
    answers: IAnswer[];
    tone:"casual"|"professional"|"emotional"
}

const verifyOwnership = (
    populatedRequest: PopulatedRequest,
    ownerId:string
) => {
    if (populatedRequest.owner.toString() !== ownerId) {
        throw new AppError("Unauthorized",403)
    }
}

export const submitResponseService = async(
    token: string,
    data:ISubmitResponseData
) => {
    const request = await TestimonialRequest.findOne({ token });

    if (!request) {
        throw new AppError("Invalid or expired link",404)
    }

    if (request.status === "CLOSED") {
        throw new AppError("This testimonial link has been closed",410)
    }

    if (request.expiresAt && new Date(request.expiresAt) < new Date()) {
        throw new AppError("This testimonial link has expired", 410);
    }

    if (!request.allowAnonymous && !data.clientEmail) {
        throw new AppError("Email is required for this form",400)
    }

    if (data.clientEmail) {
        const existing = await TestimonialResponse.findOne({
            request: request._id,
            clientEmail: data.clientEmail,
            status:{$in:["PENDING","APPROVED"]}
        })

        if (existing) {
            throw new AppError(
                "You have already submitted a testimonial for this request",
                409
            )
        }
    }

    // todo call LLM to generate testimonial
    const generatedContent = await generateTestimonial(
        data.answers,
        data.tone,
        request.title
    )

    const response = await TestimonialResponse.create({
        request: request._id,
        clientName: data.clientName,
        clientEmail: data.clientEmail ?? null,
        clientCompany: data.clientCompany ?? null,
        rating: data.rating,
        answers: data.answers,
        generatedTestimonials: [
            {
                content:generatedContent,
                tone: data.tone,
                createdAt:new Date()
            }
        ],
        status: "PENDING",
        isPublished:false
    })

    await TestimonialRequest.findByIdAndUpdate(request._id, {
        $inc:{submissionCount:1}
    })

    return response
}
export const uploadClientAvatarService = async(
    responseId: string,
    fileBuffer:Buffer
) => {
    const response = await TestimonialResponse.findById(responseId);
    if (!response) throw new AppError("Response not found", 404);

    const result = await uploadImageToCloudinary(
        fileBuffer,
        "speakwell/client-avatars",
        responseId
    )
    response.clientAvatar = result.secure_url;
    await response.save();
    return response;
}
export const getResponseByRequestService = async(
    requestId: string,
    ownerId:string
) => {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError("Invalid request ID",400)
    }

    const request = await TestimonialRequest.findOne({
        _id: requestId,
        owner:ownerId
    })

    if (!request) {
        throw new AppError("Request not found",404)
    }

    const response = await TestimonialResponse.find({ request: requestId })
        .sort({ createdAt: -1 })
        .select("-__v");
    
    return response;
}

export const getResponseByIdService = async(
    responseId: string,
    ownerId:string
) => {
    if (!mongoose.Types.ObjectId.isValid(responseId)) {
        throw new AppError("Invalid response ID",400)
    }

    const response = await TestimonialResponse.findById(responseId)
        .populate<{ request: PopulatedRequest }>({
            path: "request",
            select: "owner title"
        })
        .select("-__v");
    
    if (!response) {
        throw new AppError("Response not found",404)
    }
    verifyOwnership(response.request, ownerId)
    
    return response
}

export const approveResponseService = async(
    responseId: string,
    ownerId: string,
    approvedTestimonial:string
) => {
    if (!mongoose.Types.ObjectId.isValid(responseId)) {
        throw new AppError("Invalid response ID",400)
    }

    const response = await TestimonialResponse.findById(responseId)
        .populate<{ request: PopulatedRequest }>({ path: "request", select: "owner" })
    
    if (!response) {
        throw new AppError("Response not found", 404);
    }

    verifyOwnership(response.request, ownerId);

    if (response.status === "REJECTED") {
        throw new AppError("Cannot approve a rejected response",400)
    }

    response.approvedTestimonial = approvedTestimonial;
    response.status = "APPROVED";

    await response.save();
    return response;
}

export const rejectResponseService = async(
    responseId: string,
    ownerId:string
) => {
    if (!mongoose.Types.ObjectId.isValid(responseId)) {
        throw new AppError("Invalid response ID",400)
    }

    const response = await TestimonialResponse.findById(responseId).populate<{
        request:PopulatedRequest
    }>({ path: "request", select: "owner" })
    
    if (!response) {
        throw new AppError("Response not found", 404);
    }

    verifyOwnership(response.request, ownerId);

    response.status = "REJECTED";
    response.isPublished = false;
    response.approvedTestimonial = null;
    await response.save();

    return response;
}

export const togglePublishResponseService = async(
    responseId: string,
    ownerId:string
) => {
    if (!mongoose.Types.ObjectId.isValid(responseId)) {
        throw new AppError("Invalid response ID",400)
    }

    const response = await TestimonialResponse.findById(responseId).populate<{
        request:PopulatedRequest
    }>({ path: "request", select: "owner" })
    
    if (!response) {
        throw new AppError("Response not found", 404)
    }

    verifyOwnership(response.request, ownerId)
    
    if (response.status !== "APPROVED") {
        throw new AppError("Only approved testimonials can be published",400)
    }

    if (!response.approvedTestimonial) {
        throw new AppError("Approve and edit the testimonial before publishing",400)
    }

    response.isPublished = !response.isPublished;
    await response.save();

    return response;
}

export const deleteResponseService = async(
    responseId : string,
    ownerId:string
) => {
    if (!mongoose.Types.ObjectId.isValid(responseId)) {
        throw new AppError("Invalid response ID",400)
    }

    const response = await TestimonialResponse.findById(responseId).populate<{
        request:PopulatedRequest
    }>({ path: "request", select: "owner" })
    
    if (!response) {
        throw new AppError("Response not found",404)
    }

    verifyOwnership(response.request, ownerId);

    await response.deleteOne();

    await TestimonialRequest.findByIdAndUpdate(response.request, {
        $inc:{submissionCount:-1}
    })
}