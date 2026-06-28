import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { Feather, Eye, EyeOff, Loader2 } from "lucide-react";
import { registerApi } from "@/api/auth.api";
import { registerSchema } from "@/validations/auth.validation";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import axios from "axios";

type RegisterFormData = z.infer<typeof registerSchema>;



const RegisterPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState:{errors,isSubmitting},
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null);
        try {
            await registerApi(data);
            toast.success("Account created successfully! Please check your email for verification.")
            navigate("/verify-email", { state: { email: data.email } });
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                 toast.error(err?.response?.data?.message ?? "Something went wrong. Please try again.")
            setServerError(err?.response?.data?.message ?? "Something went wrong. Please try again")
            }
        }
    }
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

              {/* Card */}
              <Card className="border-border bg-surface ring-1 ring-border">
                  <CardHeader>
                       <CardTitle className="text-xl font-semibold tracking-tight text-text-primary text-center">
                      Create your account
                  </CardTitle>
                  <CardDescription className="text-sm text-text-secondary text-center">
                      Start collecting testimonials in minutes
                  </CardDescription>
                 </CardHeader>

                  <CardContent>
                  {serverError && (
                      <div className="mb-4 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                          {serverError}
                      </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                          <Label htmlFor="name">
                              Name
                          </Label>

                          <Input type="text"
                              id="name"
                              placeholder="Deep Prajapati"
                                  {...register("name")}
                                  className="text-sm"
                          />
                          {errors.name && (
                              <p className="text-xs text-error">{errors.name.message}</p>
                          )}
                      </div>


                      {/* Email */}
                      <div className="space-y-1.5">
                          <Label htmlFor="email">Email</Label>

                          <Input type="email"
                                  id="email"
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
                          <Label htmlFor="password">Password</Label>

                          <div className="relative">
                              <Input type={showPassword ? "text": "password"}
                              id="password"
                                  placeholder="********"
                                  {...register("password")}
                               className="pr-10"   
                              />
                              <button type="button"
                                  onClick={() => setShowPassword((v) => !v)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-secondary"
                                    tabIndex={-1}
                                  >{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                          </div>

                          {errors.password && (
                              <p className="text-xs text-error">
                                  {errors.password.message}
                              </p>
                          )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                          <Label htmlFor="confirmPassword"
                            className="mb-1.5 block text-sm font-medium text-text-primary"
                          >Confirm Password</Label>

                          <div className="relative">
                              <Input type={showConfirmPassword ? "text": "password"}
                              id="confirmPassword"
                                  placeholder="********"
                                  {...register("confirmPassword")}
                               className="pr-10"   
                              />
                              <button type="button"
                                  onClick={() => setShowConfirmPassword((v) => !v)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-secondary"
                                    tabIndex={-1}
                                  >{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
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
                          className="w-full bg-text-primary text-background hover:bg-accent-hover font-medium text-sm hover:cursor-pointer "
                      >
                          {isSubmitting ? (
                              <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating account...
                              </>
                          ) : (
                                  "Create account"
                          )}
                      </Button>
                  </form>

                  <p className="mt-6 text-center text-sm text-text-secondary">
                      Already have an account?{" "}
                      <Link to="/login" className="font-medium text-text-primary hover:underline">
                          Log in
                      </Link>
                      </p>
                      </CardContent>
              </Card>

              <p className="mt-6 text-center text-xs text-text-muted">
                  By signing up, you agree to our Terms and Privacy Policy.
              </p>
          </div>
    </div>
  )
}

export default RegisterPage