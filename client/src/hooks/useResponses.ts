import useSWR from "swr";
import { getRequestByIdApi } from "@/api/request.api";

import { getResponsesByRequestApi, approveResponseApi, rejectResponseApi, togglePublishResponseApi, deleteResponseApi } from "@/api/response.api";


export const useRequestDetail = (id: string) => {
  const { data, error, isLoading,mutate } = useSWR(
    id ? `/requests/${id}` : null,
    async()=>(await getRequestByIdApi(id)).data.data
  )

  return {request:data,isLoading,error,mutate}
}

export const useResponsesByRequest = (requestId: string) => {
  const { data,error,isLoading,mutate} = useSWR(
    requestId ? `/responses/request/${requestId}` : null,
    async()=>(await getResponsesByRequestApi(requestId)).data.data
  )

  return {responses:data ?? [],isLoading,error,mutate}
}

export const approveResponse = (id: string, text: string) => approveResponseApi(id, text)

export const rejectResponse = (id: string) => rejectResponseApi(id)

export const togglePublishResponse = (id: string) => togglePublishResponseApi(id)

export const deleteResponse=(id:string)=>deleteResponseApi(id)