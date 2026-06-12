import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { IUser } from "@/types";
import { getMeApi, logoutApi } from "@/api/auth.api";

export const AuthProvider = ({ children }:{children:ReactNode}) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

     const fetchUser = async () => {
        try {
            const res = await getMeApi();
            setUser(res.data.data ?? null)
        } catch  {
            setUser(null)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])
    
    const logout = async () => {
        try {
            await logoutApi()
        } finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoading,
                logout,
                refetchUser:fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}