import { api } from "./axios";
import type { IApiResponse, ITestimonialRequest, IQuestion } from "@/types";

interface ICreateRequestPayload{
    title: string;
    questions: IQuestion[];
    theme: "light" | "dark";
    allowAnonymous: boolean;
    expiresAt?:string | null
}

export const createRequestApi = (data: ICreateRequestPayload) =>
    api.post<IApiResponse<ITestimonialRequest>>("/requests", data)

export const getRequestsApi = () =>
    api.get<IApiResponse<ITestimonialRequest[]>>("/requests");

export const getRequestByIdApi = (id: string) =>
    api.get<IApiResponse<ITestimonialRequest>>(`/requests/${id}`)

export const getRequestByTokenApi = (token: string) =>
    api.get<IApiResponse<Partial<ITestimonialRequest>>>(`/requests/form/${token}`);

export const updateRequestApi = (
    id: string,
    data:Partial<ICreateRequestPayload>
) => api.patch<IApiResponse<ITestimonialRequest>>(`/requests/${id}`, data)

export const closeRequestApi = (id: string) =>
    api.patch<IApiResponse<ITestimonialRequest>>(`/requests/${id}/close`)

export const deleteRequestApi = (id: string) =>
    api.delete<IApiResponse>(`/requests/${id}`)
