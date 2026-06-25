import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import LandingPage from "@/pages/public/LandingPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import LoginPage from "@/pages/auth/LoginPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import DashboardLayout from "@/components/shared/DashboardLayout";
import DashboardOverviewPage from "@/pages/dashboard/DashboardOverviewPage";
import RequestsPage from "@/pages/dashboard/RequestPage";
import CreateRequestPage from "@/pages/dashboard/CreateRequestPage";
import RequestDetailPage from "@/pages/dashboard/RequestDetailPage";
import TestimonialFormPage from "@/pages/public/TestimonialFormPage";
import TestimonialsPage from "@/pages/dashboard/TestimonialsPage";
import TestimonialDetailPage from "@/pages/dashboard/TestimonialDetailPage";
import WidgetSettingsPage from "@/pages/dashboard/WidgetSettingsPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";
import { RouteErrorBoundary } from "@/components/shared/RouteErrorBoundary";
import NotFound from "@/pages/public/NotFound";





export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
        errorElement:<RouteErrorBoundary/>
    },
    {
        path: "/r/:token",
        element:<TestimonialFormPage/>,
        errorElement:<RouteErrorBoundary/>
    },
    // Auth routes
    {
        element: <PublicRoute />,
        errorElement:<RouteErrorBoundary/>,
        children: [
            { path: "/register", element: <RegisterPage /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/forgot-password", element: <ForgotPasswordPage /> },
            {path:"/reset-password",element:<ResetPasswordPage/>},
        ]
    },
    { path: "/verify-email", element: <VerifyEmailPage />,errorElement:<RouteErrorBoundary/> },
    {
        element: <ProtectedRoute />,
        errorElement:<RouteErrorBoundary/>,
        children:[
            {
                path: "/dashboard",
                element:<DashboardLayout/>,
                children: [
                    { index: true, element: <DashboardOverviewPage /> },
                    {path:"requests",element:<RequestsPage/>},
                    { path: "requests/new", element: <CreateRequestPage /> },
                    {path:"requests/:id/edit",element:<CreateRequestPage/>},
                    { path: "requests/:id", element: <RequestDetailPage /> },
                    { path: "testimonials", element: <TestimonialsPage /> },
                    { path: "testimonials/:id", element: <TestimonialDetailPage /> },
                    { path: "widget", element: <WidgetSettingsPage /> },
                    {path:"profile",element:<ProfilePage/>}
                    
                ]
            }
        ]
    },
    {
        path: "*",
        element:<NotFound/>
    }
])
export const AppRouter=()=><RouterProvider router={router} />