import { api } from "./axios";
import type { IApiResponse, IDashboardStats, ITestimonialResponse, IPagination } from "@/types";

export const getDashboardStatsApi = () =>
    api.get<IApiResponse<IDashboardStats>>("/dashboard/stats")

export const getDashboardTestimonialsApi = (params: {
    status?: string;
    isPublished?: string;
    requestId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: string
}) =>
    api.get<IApiResponse<ITestimonialResponse[]> & { pagination: IPagination }>(
        "/dashboard/testimonials",
        { params }
    );

export const getRecentActivityApi = () =>
    api.get<IApiResponse<ITestimonialResponse[]>>("/dashboard/recent-activity");