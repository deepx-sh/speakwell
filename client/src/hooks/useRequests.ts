import useSWR from "swr";
import { getRequestsApi, closeRequestApi, deleteRequestApi } from "@/api/request.api";

export const useRequests = () => {
    const { data, error, isLoading, mutate } = useSWR(
        "/requests",
        async()=>(await getRequestsApi()).data.data
    )

    return {
        requests: data ?? [],
        isLoading,
        error,
        mutate
    }
}

export const closeRequest = (id: string) => closeRequestApi(id)
export const deleteRequest = (id: string) => deleteRequestApi(id)
