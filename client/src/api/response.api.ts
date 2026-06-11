import { api } from "./axios";
import type { IApiResponse, ITestimonialResponse, IAnswer, IPagination } from "@/types";

interface ISubmitResponsePayload{
    clientName: string;
    clientEmail?: string;
    clientCompany?: string;
    rating: number;
    answers: IAnswer[];
    tone:"casual"|"professional"|"emotional"
}

export const submitResponseApi = (token: string, data: ISubmitResponsePayload) =>
    api.post<IApiResponse<ITestimonialResponse>>(`/responses/submit/${token}`, data)

export const uploadClientAvatarApi = (id: string, file: File) => {
    const formData = new FormData()
    formData.append("avatar", file)
    return api.patch<IApiResponse<ITestimonialResponse>>(
        `/responses/${id}/avatar`,
        formData,
        {headers:{"Content-Type":"multipart/form-data"}}
    )
}

export const getResponsesByRequestApi = (requestId: string) =>
    api.get<IApiResponse<ITestimonialResponse[]> & {pagination: IPagination}>(`/responses/request/${requestId}`)

export const getResponseByIdApi = (id: string) =>
    api.get<IApiResponse<ITestimonialResponse>>(`/responses/${id}`)

export const approveResponseApi = (id: string, approvedTestimonial: string) =>
    api.patch<IApiResponse<ITestimonialResponse>>(`/responses/${id}/approve`, {
        approvedTestimonial
    });

export const rejectResponseApi = (id: string) =>
    api.patch<IApiResponse<ITestimonialResponse>>(`/responses/${id}/reject`)

export const togglePublishResponseApi = (id: string) =>
    api.patch<IApiResponse<ITestimonialResponse>>(`/responses/${id}/publish`)

export const deleteResponseApi = (id: string) =>
    api.delete<IApiResponse>(`responses/${id}`)