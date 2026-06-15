import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {  Loader2, MailCheck, ArrowLeft, Sparkles } from "lucide-react"
import { forgotPasswordApi } from "@/api/auth.api"
import { forgotPasswordSchema } from "@/validations/auth.validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordPage = () => {
    const [isSent, setIsSent] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("")
    const {
        register,
        handleSubmit,
        formState:{errors,isSubmitting}
     } = useForm<ForgotPasswordFormData>({
        resolver:zodResolver(forgotPasswordSchema)
     })
    
    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            await forgotPasswordApi(data)
        } catch  {
            // 
        } finally {
            setSubmittedEmail(data.email)
            setIsSent(true)
        }
    }
  return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
          <div className="w-full max-w-sm">
              <Link to="/" className="mb-8 flex items-center justify-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-text-primary">
                      <Sparkles className="h-4 w-4 text-background"/>
                  </div>
                  
                  <span className="text-base font-medium text-text-primary">
                      Speakwell
                  </span>
              </Link>

              <Card className="border-border bg-surface  ring-1 ring-border">
                  {isSent ? (
                      <>
                          <CardHeader className="text-center">
                              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-card">
                                  <MailCheck className="h-6 w-6 text-text-secondary"/>
                              </div>

                              <CardTitle className="text-xl">Check your email</CardTitle>
                              <CardDescription>
                                  If an account exists for
                                  <br />
                                  <span className="font-medium text-text-primary">
                                      {submittedEmail}
                                  </span>
                                  <br />
                                  you'll receive a password reset link shortly
                              </CardDescription>
                          </CardHeader>
                          
                          <CardContent>
                              <p className="text-center text-xs text-text-muted">
                                  The link expires in 10 minutes. Don't forget to check your
                                  spam folder.
                              </p>

                              <Link to="/login" className="mt-6 block">
                                  <Button variant="outline" className="w-full bg-text-primary text-background hover:bg-accent-hover font-medium text-sm hover:cursor-pointer">
                                      <ArrowLeft className="mr-2 h-4 w-4" />
                                      Back to login
                                </Button>
                              </Link>
                          </CardContent>
                      </>  
                  ) : <>
                          <CardHeader>
                              <CardTitle className="text-xl">Forgot Password</CardTitle>
                              <CardDescription>
                                  Enter your email and we'll send you a link to reset your password.
                              </CardDescription>
                          </CardHeader>
                          
                          <CardContent>
                              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                  <div className="space-y-1.5">
                                      <Label htmlFor="email">Email</Label>
                                      <Input
                                          id="email"
                                          type="email"
                                          placeholder="you@example.com"
                                          {...register("email")}
                                      />

                                      {errors.email && (
                                          <p className="text-xs text-error">
                                              {errors.email.message}
                                          </p>
                                      )}
                                  </div>

                                  <Button type="submit" disabled={isSubmitting} className="w-full bg-text-primary text-background hover:bg-accent-hover font-medium text-sm hover:cursor-pointer">
                                      {isSubmitting ? (
                                          <>
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                              Sending...
                                          </>
                                      ) : (
                                              "Send reset link"
                                      )}
                                  </Button>
                              </form>

                              <p className="mt-6 text-center text-sm text-text-secondary">
                                  Remember your password?{" "}
                                  <Link to="/login"  className="font-medium text-text-primary hover:underline">Log in</Link>
                              </p>
                          </CardContent>
                  </>}
              </Card>
          </div>
    </div>
  )
}

export default ForgotPasswordPage