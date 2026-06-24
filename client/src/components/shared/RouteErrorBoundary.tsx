import { AlertTriangle,ArrowLeft } from "lucide-react";
import { useRouteError,isRouteErrorResponse,Link,useNavigate } from "react-router-dom";

import { Button } from "../ui/button";

export function RouteErrorBoundary() {
    const error = useRouteError()
    const navigate = useNavigate()
    
    let title = "Something went wrong"
    let message = "An unexpected error occurred while loading this page"
    
    if (isRouteErrorResponse(error)) {
        title = `Error ${error.status}`
        message=error.statusText || message
    } else if (error instanceof Error) {
        message=error.message
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
                    <AlertTriangle className="h-6 w-6 text-error"/>
                </div>

                <h1 className="text-lg font-medium text-text-primary">{title}</h1>
                <p className="mt-2 text-sm text-text-secondary">{message}</p>

                <div className="mt-6 flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                        Go back
                    </Button>

                    <Link to="/">
                        <Button size="sm">Go home</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
