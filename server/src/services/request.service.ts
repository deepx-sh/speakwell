import mongoose from "mongoose";
import TestimonialRequest from "../models/testimonialRequest.model";
import { generateToken } from "../utils/generateToken";
import AppError from "../utils/AppError";


interface IQuestion{
    question: string;
    required: boolean;
    type:"text"|"textarea"|"rating"
}

interface ICreateRequestData{
    title: string;
    questions: IQuestion[],
    theme: "light" | "dark",
    allowAnonymous: boolean;
    expiresAt?: string | null;
}

interface IUpdateRequestData{
    title?: string;
    questions?: IQuestion[];
    theme?: "light" | "dark";
    allowAnonymous?: boolean;
     expiresAt?: string | null;
}

export const createRequestService = async(
    ownerId: string,
    data:ICreateRequestData
) => {
    const token = generateToken()
    
    const request = await TestimonialRequest.create({
        owner: ownerId,
        title: data.title,
        questions: data.questions,
        theme: data.theme,
        allowAnonymous: data.allowAnonymous,
        expiresAt: data.expiresAt ?? null,
        token
    })

    return request;
}


export const getRequestsByOwnerService = async (ownerId: string) => {
    const request = await TestimonialRequest.find({ owner: ownerId })
        .sort({ createdAt: -1 })
        .select("-__v");
    
    return request;
}

export const getRequestByIdService = async(
    requestId: string,
    ownerId:string
) => {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError("Invalid request ID",400)
    }

    const request = await TestimonialRequest.findOne({
        _id: requestId,
        owner: ownerId
    }).select("-__v");


    if (!request) {
        throw new AppError("Request not found",404)
    }

    return request;
}


export const getRequestByTokenService = async (token: string) => {
    const request = await TestimonialRequest.findOne({ token })
        .select("title questions theme allowAnonymous status expiresAt")
        .lean();
    
    if (!request) {
        throw new AppError("Invalid or expired link",404)
    }

    if (request.status === "CLOSED") {
        throw new AppError("This testimonial link has been closed",410)
    }

    if (request.expiresAt && new Date(request.expiresAt) < new Date()) {
        throw new AppError("This testimonial link has expired",410)
    }

    return request;
}

export const updateRequestService = async(
    requestId: string,
    ownerId: string,
    data:IUpdateRequestData
) => {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError("Invalid request ID",400)
    }

    const request = await TestimonialRequest.findOneAndUpdate(
        { _id: requestId, owner: ownerId },
        { ...data },
        {new:true,runValidators:true}
    )

    if (!request) {
        throw new AppError("Reqeust not found",404)
    }

    return request
}

export const closeRequestService = async(
    requestId: string,
    ownerId:string
) => {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError("Invalid request ID",400)
    }

    const request = await TestimonialRequest.findOneAndUpdate(
        { _id: requestId, owner: ownerId },
        { status: "CLOSED" },
        {new:true}
    )

    if (!request) {
        throw new AppError("Request not found",404)
    }
    return request;
}

export const deleteRequestService = async(
    requestId: string,
    ownerId:string
) => {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError("Invalid request ID",400)
    }

    const request = await TestimonialRequest.findOneAndDelete({
        _id: requestId,
        owner:ownerId
    })

    if (!request) {
        throw new AppError("Request not found",404)
    }
}