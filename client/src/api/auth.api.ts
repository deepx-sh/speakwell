import { api } from "./axios";
import type { IApiResponse, IUser } from "@/types";

export const registerApi = (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword:string
}) => api.post<IApiResponse>("/auth/register", data)

export const verifyEmailApi = (data: { email: string; otp: string }) =>
    api.post<IApiResponse<{ user: IUser }>>("/auth/verify-email", data)

export const loginApi = (data: { email: string; password: string }) =>
    api.post<IApiResponse<{ user: IUser }>>("/auth/login", data);

export const logoutApi =()=> api.post<IApiResponse>("/auth/logout")

export const forgotPasswordApi = (data: { email: string }) =>
    api.post<IApiResponse>("/auth/forgot-password", data)

export const resetPasswordApi = (data: {
    token: string;
    newPassword: string;
    confirmPassword: string
}) => api.post<IApiResponse>("/auth/reset-password", data);

export const resendOtpApi = (data: { email: string; type: "VERIFY_EMAIL" }) =>
    api.post<IApiResponse>("/auth/resend-otp", data);

export const getMeApi=()=>api.get<IApiResponse<IUser>>("/users/me")