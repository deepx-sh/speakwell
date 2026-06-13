import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {SWRConfig} from "swr"
import './index.css'
import { AuthProvider } from './context/AuthProvider.tsx'
import { AppRouter } from './router/index.tsx'
import  {Toaster} from "@/components/ui/sonner.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>,
)
