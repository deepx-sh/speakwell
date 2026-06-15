import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from "sonner"
import { Sparkles, Loader2, MailCheck } from "lucide-react"
import { verifyEmailApi, resendOtpApi } from "@/api/auth.api"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser, user } = useAuth()
    
    const email = (location.state as { email?: string })?.email ?? user?.email ?? ""
    
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)
    const [error, setError] = useState<string | null>(null)
    

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!email) {
            navigate("/register")
        }
    }, [email, navigate])
    
    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        return ()=> clearInterval(timer)
    }, [cooldown])
    
    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError(null)

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newOtp.every((d) => d !== "") && index === OTP_LENGTH - 1 && value) {
            handleVerify(newOtp.join(""))
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").trim()
        
        if (!/^\d*$/.test(pasted)) return;

        const digits = pasted.slice(0, OTP_LENGTH).split("");
        const newOtp = Array(OTP_LENGTH).fill("")
        digits.forEach((d, i) => (newOtp[i] = d))
        setOtp(newOtp)

        const lastIndex = Math.min(digits.length, OTP_LENGTH) - 1;
        inputRefs.current[lastIndex]?.focus()
        if (digits.length === OTP_LENGTH) {
            handleVerify(newOtp.join(""))
        }
    }


    const handleVerify = async (otpValue?: string) => {
        const code = otpValue ?? otp.join("")
        
        if (code.length !== OTP_LENGTH) {
            setError("Please enter the complete 6-digit OTP")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const res = await verifyEmailApi({ email, otp: code })
            setUser(res.data.data?.user ?? null)
            toast.success("Email verified successfully")
            navigate("/dashboard")
        } catch (err:any) {
            const message = err?.response?.data?.message ?? "Invalid or expired code. Please try again"
            setError(message)
            setOtp(Array(OTP_LENGTH).fill(""))
            inputRefs.current[0]?.focus()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResend = async () => {
        setIsResending(true)
        setError(null)

        try {
            await resendOtpApi({ email, type: "VERIFY_EMAIL" })
            toast.success("A new code has been sent to your email")
            setCooldown(RESEND_COOLDOWN)
            setOtp(Array(OTP_LENGTH).fill(""))
            inputRefs.current[0]?.focus()
        } catch (err:any) {
            const message = err?.response?.data?.message ?? "Failed to resend OTP"
            toast.error(message)

            const match = message.match(/(\d+)\s*seconds?/)
            if(match) setCooldown(parseInt(match[1],10))
        } finally {
            setIsResending(false)
        }
    }

    if (!email) return null;
  return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
          <div className="w-full max-w-sm">
              <Link
                  to="/"
                  className="mb-8 flex items-center justify-center gap-2"
              >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-text-primary">
                      <Sparkles className="h-4 w-4 text-background"/>
                  </div>
                  <span className="text-base font-medium text-text-primary">
                      Speakwell
                  </span>
              </Link>

              <Card className="border-border bg-surface ring-1 ring-border">
                  <CardHeader className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-card">
                          <MailCheck className="h-6 w-6 text-text-secondary"/>
                      </div>
                      <CardTitle className="text-xl">Check your email</CardTitle>
                      <CardDescription>
                          We sent a 6-digit OTP to
                          <br />
                          <span className="font-medium text-text-primary">{email}</span>
                      </CardDescription>
                  </CardHeader>

                  <CardContent>
                      <div className="flex justify-center gap-2">
                          {otp.map((digit, index) => (
                              <input
                                  key={index}
                                  ref={(el) => { inputRefs.current[index] = el }}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) => handleChange(index, e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(index, e)}
                                  onPaste={index === 0 ? handlePaste : undefined}
                                  disabled={isSubmitting}
                                  className="h-12 w-11 rounded-md border border-border bg-card text-center text-lg font-medium text-text-primary outline-none transition focus:ring-2 focus:ring-text-secondary focus:border-text-secondary disabled:opacity-50"
                              />
                          ))}
                      </div>

                      {error && (
                          <p className="mt-3 text-center text-xs text-error">{error}</p>
                      )}

                      <Button
                          type="button"
                          onClick={() => handleVerify()}
                          disabled={isSubmitting || otp.some((d) => !d)}
                          className="mt-6 w-full"
                      >
                          {isSubmitting ? (
                              <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Verifying...
                              </>
                          ) : (
                                  "Verify Email"
                          )}
                      </Button>

                      {/* Resend */}

                      <div className="mt-4 text-center text-sm text-text-secondary">
                          Didn't receive a code?{" "}
                          {cooldown > 0 ? (
                              <span className="text-text-muted">Resend in {cooldown}</span>  
                          ) : (
                                  <button
                                      type="button"
                                      onClick={handleResend}
                                      disabled={isResending}
                                      className="font-medium text-primary hover:underline disabled:opacity-50"
                                  >
                                      {isResending ? "Sending..." : "Resend code"}
                                  </button>
                          )}
                      </div>
                  </CardContent>
              </Card>

              <p className="mt-6 text-center text-xs text-text-muted">
                  Wrong email?{" "}
                  <Link to="/register" className="text-text-secondary hover:underline">
                  Go back</Link>
              </p>
          </div>
    </div>
  )
}

export default VerifyEmailPage