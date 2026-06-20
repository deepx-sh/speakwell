import { useState,useEffect,useMemo } from "react"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {toast} from "sonner"
import { Sparkles,Star,Loader2,CheckCircle2,Upload,XCircle } from "lucide-react"


import { getRequestByTokenApi } from "@/api/request.api"
import { submitResponseApi,uploadClientAvatarApi } from "@/api/response.api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import type { IQuestion, ITestimonialRequest } from "@/types"
import { cn } from "@/lib/utils"
import axios from "axios"

const TONE_OPTIONS = [
    { value: "casual", label: "Casual", desc: "Like talking to a friend" },
    { value: "professional", label: "Professional", desc: "Clear and direct" },
    {value:"emotional",label:"Emotional",desc:"Story-driven, warm"}
] as const


// Dynamic schema based on questions

const buildFormSchema = (questions: IQuestion[]) => {
    const answerFields: Record<string, z.ZodType> = {}
    
    questions.forEach((q, i) => {
        answerFields[`answer_${i}`]=q.required ? z.string().trim().min(1,"This field is required"):z.string().trim().optional().default("")
    })

    return z.object({
    clientName: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name too long"),
    
    clientEmail:z
        .string()
        .check(z.trim(), z.email("Invalid email address"), z.toLowerCase())
        .optional()
        .or(z.literal("")),
    
    clientCompany: z
        .string()
        .trim()
        .max(100, "Company name too long")
        .optional()
        .default(""),
    
    rating: z
        .number()
        .min(1, "Minimum rating is 1")
        .max(5, "Maximum rating is 5"),
    
        tone: z.enum(["casual", "professional", "emotional"]),
    ...answerFields
    })
}

type FormData = {
    clientName: string;
    clientEmail?: string
    clientCompany?: string
    rating: number;
    tone: "casual" | "professional" | "emotional"
    
    [key: `answer_${number}`]: string | undefined;
}

const TestimonialFormPage = () => {
    const { token } = useParams<{ token: string }>()
    
    const [request, setRequest] = useState<Partial<ITestimonialRequest> | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [isLoadingRequest, setIsLoadingRequest] = useState(true)
    
    const [rating, setRating] = useState(5)
    const [tone, setTone] = useState<"casual" | "professional"| "emotional">("casual")
    
    const [submittedId, setSubmittedId] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [avatarSkipped,setAvatarSkipped]=useState(false)


    useEffect(() => {
        if (!token) return;

        getRequestByTokenApi(token)
            .then((res) => setRequest(res.data.data ?? null))
            .catch((err) => {
                setLoadError(err?.response?.data?.message ?? "This link is invalid or has expired")
            })
            .finally(()=>setIsLoadingRequest(false))
    }, [token])
    
    const questions = useMemo(
        () => request?.questions ?? [],
        [request?.questions]
    )
    

    // Form setup

    const schema = useMemo(() => buildFormSchema(questions), [questions])
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onBlur",
    })

    useEffect(() => {
        setValue("rating", rating)
        setValue("tone",tone)
    }, [rating, tone, setValue])
    

    // submit

    const onSubmit = async (data: FormData) => {
        if (!token) return;

        const answers = questions.map((q, i) => ({
            question: q.question,
            answer:data[`answer_${i}`] || ""
        }))

        try {
            const res = await submitResponseApi(token, {
                clientName: data.clientName,
                clientEmail: data.clientEmail || undefined,
                clientCompany: data.clientCompany || undefined,
                rating: data.rating,
                answers,
                tone:data.tone
                
            })

            setSubmittedId(res.data.data?._id ?? null)
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message ?? "Failed to submit. Please try again")
            }
        }
    }

    // avatar upload
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be under 2MB")
            return
        }

        if (avatarPreview) URL.revokeObjectURL(avatarPreview)
        
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const handleAvatarUpload = async () => {
        if (!avatarFile || !submittedId) return
        
        setIsUploadingAvatar(true)
        try {
            await uploadClientAvatarApi(submittedId, avatarFile)
            toast.success("Photo added successfully")
            setAvatarSkipped(true)
        } catch {
            toast.error("Failed to upload photo")
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    // cleanup preview url
    useEffect(() => {
        return () => {
            if(avatarPreview) URL.revokeObjectURL(avatarPreview)
        }
    }, [avatarPreview])
    

    // Loading | Error | Success state

    if (isLoadingRequest) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className="w-full max-w-md space-y-4">
                    <Skeleton className="h-8 w-48"/>
                    <Skeleton className="h-64 w-full"/>
                </div>
            </div>
        )
    }

    if (loadError || !request) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <Card className="w-full max-w-sm border-border bg-surface">
                    <CardContent className="flex flex-col items-center py-10 text-center">
                        <XCircle className="mb-3 h-8 w-8 text-error" />
                        <p className="text-sm font-medium text-text-primary">Link unavailable</p>
                        <p className="mt-1 text-sm text-text-secondary">{loadError}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (submittedId) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
                <Card className="w-full max-w-sm border-border bg-surface">
                    <CardContent className="flex flex-col items-center py-8 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                            <CheckCircle2 className="h-6 w-6 text-success"/>
                        </div>
                        <p className="text-lg font-medium text-text-primary">Thank you!</p>
                        <p className="mt-1 text-sm text-text-secondary">
                            Your testimonial has been submitted.
                        </p>

                        {!avatarSkipped && (
                            <div className="mt-6 w-full">
                                <Separator />
                                <p className="mt-4 text-sm text-text-secondary">
                                    Want to add a photo? (optional)
                                </p>

                                <div className="mt-3 flex items-center justify-center gap-3">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="preview"
                                            className="h-16 w-16 rounded-full object-cover"
                                        />
                                    ) : (
                                            <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-dashed border-border text-text-muted transition hover:border-text-secondary">
                                                <Upload className="h-5 w-5" />
                                                <input type="file"
                                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                                    className="hidden"
                                                    onChange={handleAvatarChange}
                                                />
                                            </label>
                                    )}
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={()=>setAvatarSkipped(true)}
                                    >
                                        Skip
                                    </Button>

                                    <Button
                                        className="flex-1"
                                        onClick={handleAvatarUpload}
                                        disabled={!avatarFile || isUploadingAvatar}
                                    >
                                        {isUploadingAvatar ? (
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                        ) : (
                                                "Upload"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }
  return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
          <div className="w-full max-w-lg">
              {/* logo */}
              <div className="mb-6 flex items-center justify-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-text-primary">
                      <Sparkles className="h-4 w-4 text-background"/>
                  </div>

                  <span className="text-sm text-text-secondary">Powered by Speakwell</span>
              </div>

              <Card className="border-border bg-surface">
                  <CardContent className="p-6">
                      <h1 className="text-xl font-semibold tracking-tight text-text-primary">
                          {request.title}
                      </h1>
                      <p className="mt-1 text-sm text-text-secondary">
                          Takes about 2 minutes. Your honest words help others trust this business.
                      </p>

                      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                          {/* name */}
                          <div className="space-y-1.5">
                              <Label htmlFor="clientName">Your name</Label>
                              <Input
                                  id="clientName"
                                  placeholder="Deep Prajapati"
                                  {...register("clientName")}
                              />
                              {errors.clientName && (
                                  <p className="text-xs text-error">
                                      {String(errors.clientName.message)}
                                  </p>
                              )}
                          </div>

                          {/* email */}
                          <div className="space-y-1.5">
                              <Label htmlFor="clientEmail">
                                  Email{" "}
                                  {request.allowAnonymous && (
                                      <span className="text-text-muted">(optional)</span>
                                  )}
                              </Label>

                              <Input
                                  id="clientEmail"
                                  type="email"
                                  placeholder="you@example.com"
                                  {...register("clientEmail")}
                              />

                              {errors.clientEmail && (
                                  <p className="text-xs text-error">
                                      {String(errors.clientEmail.message)}
                                  </p>
                              )}
                          </div>

                          {/* company */}
                          <div className="space-y-1.5">
                              <Label htmlFor="clientCompany">
                                  Company <span className="text-text-muted">(optional)</span>
                              </Label>

                              <Input
                                  id="clientCompany"
                                  placeholder="Acme Inc."
                                  {...register("clientCompany")}
                              />

                              {errors.clientCompany && (
                                  <p className="text-xs text-error">
                                      {errors.clientCompany.message}
                                  </p>
                              )}
                          </div>

                          {/* Rating */}
                          <div className="space-y-1.5">
                              <Label>Overall rating</Label>
                              <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                      <button
                                          key={i}
                                          type="button"
                                          onClick={() => setRating(i + 1)}
                                          className="transition hover:scale-110"
                                          aria-label={`Rate ${i+1} star${i==0 ?"":"s"}`}
                                      >
                                          <Star
                                              className={cn(
                                                  "h-7 w-7",
                                                  i<rating ? "fill-info text-info":"fill-none text-text-muted"
                                            )}
                                          />
                                      </button>
                                  ))}
                              </div>
                          </div>

                          {/* dynamic questions */}
                          {questions.map((q, i) => (
                              <div key={i} className="space-y-1.5">
                                  <Label htmlFor={`answer_${i}`}>
                                      {q.question}{" "}
                                      {!q.required && (
                                          <span className="text-text-muted">(optional)</span>
                                      )}
                                  </Label>
                                  {q.type === "textarea" ? (
                                      <Textarea
                                          id={`answer_${i}`}
                                          rows={3}
                                          placeholder="Type your answer..."
                                          {...register(`answer_${i}`)}
                                      />
                                  ) : q.type === "rating" ? (
                                          <Input
                                              id={`answer_${i}`}
                                              type="number"
                                              min={1}
                                              max={5}
                                              {...register(`answer_${i}`)}
                                          />
                                      ) : (
                                              <Input
                                                  id={`answer_${i}`}
                                                  placeholder="Type your answer..."
                                                  {...register(`answer_${i}`)}
                                              />
                                  )}

                                  {errors[`answer_${i}`] && (
                                      <p className="text-xs text-error">
                                          {String(errors[`answer_${i}`]?.message)}
                                      </p>
                                  )}
                              </div>
                          ))}

                          {/* tone selectors */}
                          <div className="space-y-2">
                              <Label>How should it sound?</Label>
                              <div className="grid grid-cols-3 gap-2">
                                  {TONE_OPTIONS.map((t) => (
                                      <button
                                          key={t.value}
                                          type="button"
                                          onClick={() => setTone(t.value)}
                                          className={cn(
                                              "rounded-md border p-3 text-left transition",
                                              tone === t.value 
                                                  ? "border-text-primary bg-card"
                                                  : "border-border hover:bg-card"
                                          )}
                                      >
                                          
                                          <p className="text-xs font-medium text-text-primary">
                                              {t.label}
                                          </p>

                                          <p className="mt-0.5 text-[11px] text-text-muted">
                                              {t.desc}
                                          </p>
                                      </button>
                                  ))}
                              </div>
                          </div>

                          {/* submit */}
                          <Button type="submit" disabled={isSubmitting} className="w-full">
                              {isSubmitting ? (
                                  <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Submitting...
                                  </>
                              ):(
                              "Submit testimonial"
                              )}
                          </Button>
                      </form>
                  </CardContent>
              </Card>
          </div>
    </div>
  )
}

export default TestimonialFormPage