import { useState, useEffect } from "react"
import { Link,useNavigate,useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Feather, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { resetPasswordApi } from "@/api/auth.api"
import { resetPasswordSchema } from "@/validations/auth.validation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card,CardContent,CardHeader,CardTitle,CardDescription } from "@/components/ui/card"
import axios from "axios"

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    
    const { register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema)
    })

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset link")
            navigate("/forgot-password")
        }
    }, [token, navigate])
    
    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) return
        
        setServerError(null)

        try {
            await resetPasswordApi({
                token,
                newPassword: data.newPassword,
                confirmPassword:data.confirmPassword
            })
            setIsSuccess(true)
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                 setServerError(err?.response?.data?.message ?? "This reset link is invalid or has expired")
            }
        }
    }

    if(!token) return null
  return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
          <div className="w-full max-w-sm">
              <Link to="/" className="mb-8 flex items-center justify-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-text-primary">
                      <Feather className="h-4 w-4 text-background"/>
                  </div>
                  
                  <span className="text-base font-medium text-text-primary">
                      Speakwell
                  </span>
              </Link>

              <Card className="border-border bg-surface ring-1 ring-border">
                  {isSuccess ? (
                      <>
                          <CardHeader className="text-center">
                              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-card">
                                  <CheckCircle2 className="h-6 w-6 text-success"/>
                              </div>
                              <CardTitle className="text-xl">Password reset</CardTitle>
                              <CardDescription>
                                  Your password has been changed successfully. You can now log in with your new password
                              </CardDescription>
                          </CardHeader>

                          <CardContent>
                              <Link to="/login">
                                <Button className="w-full bg-text-primary text-background hover:bg-accent-hover font-medium text-sm hover:cursor-pointer">Go to login</Button>
                              </Link>
                          </CardContent>
                      </>
                  ) : serverError && serverError.toLowerCase().includes("expired") ? (
                          <>
                              <CardHeader className="text-center">
                                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-card">
                                      <XCircle className="h-6 w-6 text-error"/>
                                  </div>
                                  <CardTitle className="text-xl">Link expired</CardTitle>
                                  <CardDescription>
                                      This password reset link is invalid or has expired. Please request a new one
                                  </CardDescription>
                              </CardHeader>
                              
                              <CardContent>
                                  <Link to="/forgot-password">
                                      <Button className="w-full bg-text-primary text-background hover:bg-accent-hover font-medium text-sm hover:cursor-pointer">
                                          Request new link
                                    </Button>
                                  </Link>
                              </CardContent>
                          </>
                      ) : (
                              <>
                                  <CardHeader>
                                      <CardTitle className="text-xl">
                                          Set new password
                                      </CardTitle>
                                      <CardDescription>
                                          Choose a strong password for your account
                                      </CardDescription>
                                  </CardHeader>
                                  
                                  <CardContent>
                                      {serverError && (
                                          <div className="mb-4 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                                            {serverError}
                                          </div>
                                      )}

                                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                          {/* New Password */}
                                          <div className="space-y-1.5">
                                              <Label htmlFor="newPassword">New password</Label>
                                              <div className="relative">
                                                  <Input
                                                      id="newPassword"
                                                      type={showPassword ? "text" : "password"}
                                                      placeholder="********"
                                                      className="pr-10 font-semibold text-sm"
                                                      {...register("newPassword")}
                                                  />

                                                  <button
                                                      type="button"
                                                      onClick={() => setShowPassword((v) => !v)}
                                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-secondary"
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
                                              {errors.newPassword && (
                                                  <p className="text-xs text-error">
                                                      {errors.newPassword.message}
                                                  </p>
                                              )}
                                          </div>

                                          {/* Confirm Password */}
                                          <div className="space-y-1.5">
                                              <Label htmlFor="confirmPassword">Confirm new password</Label>
                                              <div className="relative">
                                                  <Input
                                                      id="confirmPassword"
                                                      type={showConfirmPassword ? "text" : "password"}
                                                      placeholder="********"
                                                      className="pr-10 font-semibold text-sm"
                                                      {...register("confirmPassword")}
                                                  />

                                                  <button
                                                      type="button"
                                                      onClick={() => setShowConfirmPassword((v) => !v)}
                                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-secondary"
                                                  >
                                                      {
                                                          showConfirmPassword ? (
                                                              <EyeOff className="h-4 w-4"/>
                                                          ) : (
                                                                  <Eye className="h-4 w-4"/>
                                                          )
                                                     } 
                                                  </button>
                                              </div>
                                              {errors.confirmPassword && (
                                                  <p className="text-xs text-error">
                                                      {errors.confirmPassword.message}
                                                  </p>
                                              )}
                                          </div>

                                          <Button
                                              type="submit"
                                              disabled={isSubmitting}
                                              className="w-full bg-text-primary text-background hover:bg-accent-hover font-medium text-sm hover:cursor-pointer"
                                          >
                                              {isSubmitting ? (
                                                  <>
                                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                      Resetting...
                                                  </>
                                              ) : (
                                                      "Reset password"
                                              )}
                                          </Button>
                                      </form>
                                  </CardContent>
                              </>
                  )}
              </Card>
          </div>
    </div>
  )
}

export default ResetPasswordPage