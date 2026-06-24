import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "../ui/button";

interface Props{
    children: ReactNode;
    fallback?:ReactNode
}

interface State{
    hasError: boolean;
    error:Error | null
}

export class ErrorBoundary extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state={hasError:false,error:null}
    }

    static getDerivedStateFromError(error: Error): State{
        return {hasError:true,error}
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("ErrorBoundary caught an error:",error,errorInfo)
    }

    handleReset = () => {
        this.setState({hasError:false,error:null})
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback
        

            return (
                <div className="flex min-h-screen items-center justify-center bg-background px-4">
                    <div className="w-full max-w-sm text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
                            <AlertTriangle className="h-6 w-6 text-error" />
                        </div>

                        <h1 className="text-lg font-medium text-text-primary">
                            Something went wrong
                        </h1>

                        <p className="mt-2 text-sm text-text-secondary">
                            An unexpected error occurred. Try refreshing the page, or go back to the dashboard
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <pre className="mt-4 max-h-32 overflow-auto rounded-md bg-surface p-3 text-left text-xs text-error">
                                {this.state.error.message}
                            </pre>
                        )}

                        <div className="mt-6 flex justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={this.handleReset}>
                                <RefreshCcw className="mr-2 h-3.5 w-3.5" />
                                Try again
                            </Button>

                            <Button size="sm" onClick={() => (window.location.href = "/dashboard")}>
                                <Home className="mr-2 h-3.5 w-3.5" />
                                Go to dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}