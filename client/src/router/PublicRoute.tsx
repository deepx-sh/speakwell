import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export const PublicRoute = () => {
    const { user, isLoading } = useAuth()
    
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-6 w-6 animate-spin text-text-secondary"/>
            </div>
        )
    }

    if (user && user.isVerified) {
        return <Navigate to="/dashboard" replace/>
    }

    return <Outlet/>
}