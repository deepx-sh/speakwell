import useSWR from "swr";
import { getDashboardTestimonialsApi } from "@/api/dashboard.api";
import type { IFilters } from "@/types";

export const useDashboardTestimonials = (filters: IFilters) => {
    const { data,error,isLoading,mutate} = useSWR(
        ["dashboard-testimonials", filters],
        async () => {
            const res = await getDashboardTestimonialsApi(filters);
            return {
                testimonials: res.data.data ?? [],
                pagination:res.data.pagination
            }
        }
    )

    return {
        testimonials: data?.testimonials ?? [],
        pagination: data?.pagination,
        isLoading,
        error,
        mutate
    }
}
