import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Sparkles, Eye, EyeOff, Loader2 } from "lucide-react"
import { loginApi } from "@/api/auth.api"
import { useAuth } from "@/hooks/useAuth"
import { loginSchema } from "@/validations/auth.validation"
import {z} from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

type LoginFormData = z.infer<typeof loginSchema>

const LoginPage = () => {
    const navigate = useNavigate()
    const { setUser } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [serverError, setServerError] = useState<string|null>(null);

    const { register,
        handleSubmit,
        formState:{errors,isSubmitting}
     } = useForm<LoginFormData>({
        resolver:zodResolver(loginSchema)
     })
    
    const onSubmit = async (data: LoginFormData) => {
        setServerError(null)

        try {
            const res = await loginApi(data);
            console.log(res);
            
            setUser(res.data.data?.user ?? null);
            toast.success("Welcome back!")
            navigate("/dashboard")
        } catch (err: any) {
            console.log(err);
            
            const message = err?.response?.data?.message ?? "Something went wrong. Please try again."
            
            if (err?.response?.status == 403 && message.toLowerCase().includes("verify")) {
                toast.info("Please verify your email first")
                navigate("/verify-email", { state: data.email })
                return
            }

            setServerError(message);
        }
    }
  return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
          <div className="w-full max-w-sm">
              <Link to="/" className="mb-8 flex items-baseline justify-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-text-primary">
                      <Sparkles className="h-4 w-4 text-background"/>
                  </div>
                  <span className="text-base font-medium text-text-primary">
                      Speakwell
                  </span>
              </Link>

              <Card className="border-border bg-surface ring-1 ring-border">
                  <CardHeader>
                      <CardTitle className="text-xl text-center">Welcome back</CardTitle>
                      <CardDescription className="text-center">Log in to your Speakwell account.</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                      {serverError && (
                          <div className="mb-4 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                              {serverError}
                          </div>
                      )}

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                          <div className="space-y-1.5">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                  id="email"
                                  type="email"
                                  placeholder="you@example.com"
                                  {...register("email")}
                                  className="text-sm"
                              />
                              {errors.email && (
                                  <p className="text-xs text-error">{errors.email.message}</p>
                              )}
                          </div>

                          {/* Password */}
                          <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                  <Label htmlFor="password">Password</Label>
                                  <Link to="/forgot-password"
                                    className="text-xs font-semibold text-text-secondary hover:text-text-primary hover:underline"
                                  >Forgot password?</Link>
                              </div>

                              <div className="relative">
                                  <Input
                                      id="password"
                                      type={showPassword ? "text" : "password"}
                                      placeholder="********"
                                      className="pr-10 text-sm"
                                      {...register("password")}
                                  />

                                  <button
                                      type="button"
                                      onClick={() => setShowPassword((v) => !v)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-secondary"
                                      tabIndex={-1}
                                  >
                                      {
                                          showPassword ? (
                                              <EyeOff className="h-4 w-4"/>
                                          ) : (
                                                  <Eye className="h-4 w-4"/>
                                          )
                                      }
                                  </button>
                              </div>

                              {errors.password && (
                                  <p className="text-xs text-error">{errors.password.message}</p>
                              )}
                          </div>

                          <Button type="submit" disabled={isSubmitting} className="w-full bg-text-primary text-background hover:bg-accent-hover font-medium text-sm hover:cursor-pointer">
                              {isSubmitting ? (
                                  <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Logging in...
                                  </>
                              ) : (
                                      "Log in"
                              )}
                          </Button>
                      </form>

                      <p className="mt-6 text-center text-sm text-text-secondary">
                          Don't have an account?{" "}
                          <Link to="/register" className="font-medium text-text-primary hover:underline">
                          Sign up</Link>
                      </p>
                  </CardContent>
              </Card>
          </div>
    </div>
  )
}

export default LoginPage