import { api } from "./axios";
import type { IApiResponse, IUser } from "@/types";

export const updateProfileApi = (data: { name?: string; avatar?: string | null }) =>
    api.patch<IApiResponse<IUser>>("/users/me", data)

export const changePasswordApi = (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword:string
}) => api.patch<IApiResponse>("/users/me/change-password", data)

export const deleteAccountApi = (password: string) =>
    api.delete<IApiResponse>("/users/me", { data: { password } })

export const uploadAvatarApi = (file: File) => {
    const formData = new FormData()
    formData.append("avatar", file)
    return api.patch<IApiResponse<IUser>>("/users/me/avatar", formData, {
        headers:{"Content-Type":"multipart/form-data"}
    })
}