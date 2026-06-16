import useSWR from "swr";
import { getDashboardStatsApi, getRecentActivityApi } from "@/api/dashboard.api";

export const useDashboardStats = () => {
  const { data, error, isLoading } = useSWR(
    "/dashboard/stats",
    async()=>(await getDashboardStatsApi()).data.data
  )

  return {
    stats: data,
    isLoading,
    error
  }
}

export const useRecentActivity = () => {
  const { data, error, isLoading } = useSWR(
    "/dashboard/recent-activity",
    async()=>(await getRecentActivityApi()).data.data
  )

  return {
    activity: data ?? [],
    isLoading,
    error
  }
}