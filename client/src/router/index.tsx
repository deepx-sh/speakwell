import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import LandingPage from "@/pages/public/LandingPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import LoginPage from "@/pages/auth/LoginPage";



export const router = createBrowserRouter([
    {
        path: "/",
        element:<LandingPage/>
    },

    // Auth routes
    {
        element: <PublicRoute />,
        children: [
            { path: "/register", element: <RegisterPage /> },
            { path: "/login", element: <LoginPage /> },
        ]
    }
])
export const AppRouter=()=><RouterProvider router={router} />