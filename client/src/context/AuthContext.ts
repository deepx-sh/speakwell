import { createContext } from "react";
import type { IUser } from "@/types";


export interface AuthContextType{
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    isLoading: boolean;
    logout: () => Promise<void>;
    refetchUser: () => Promise<void>;
}

export const AuthContext=createContext<AuthContextType | undefined>(undefined)