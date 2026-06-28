import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {SWRConfig} from "swr"
import './index.css'
import { AuthProvider } from './context/AuthProvider.tsx'
import AppRouter from './router/AppRouter.tsx'
import  {Toaster} from "@/components/ui/sonner.tsx"
import { ErrorBoundary } from './components/shared/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
          <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError:false
      }}
    >
      <AuthProvider>
        <AppRouter/>
        <Toaster richColors position='top-center'/>
      </AuthProvider>
    </SWRConfig>
    </ErrorBoundary>
  </StrictMode>,
)
