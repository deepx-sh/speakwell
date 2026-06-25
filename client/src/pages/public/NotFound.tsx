import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate=useNavigate()
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
                    <AlertTriangle className="h-6 w-6 text-error"/>
                </div>

                <h1 className="text-lg font-medium text-text-primary">404</h1>
                <p className="mt-2 text-sm text-text-secondary">Page not found</p>

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

export default NotFound