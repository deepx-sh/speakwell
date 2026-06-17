import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod"
import { toast } from "sonner"
import { Plus, Trash2, GripVertical, ArrowLeft, Loader2 } from "lucide-react";
import { createRequestApi } from "@/api/request.api";
import { createRequestSchema} from "@/validations/request.validation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


type CreateRequestFormData = z.infer<typeof createRequestSchema>


const DEFAULT_QUESTIONS = [
    {
        question: "What problem were you facing before working with us?",
        required: true,
        type:"textarea" as const
    }, {
        question: "What results did you get after working with us?",
        required: true,
        type:"textarea" as const
    }, {
        question: "Would you recommend us, and why?",
        required: true,
        type:"textarea" as const
    }
]

const QUESTION_TYPES = [
    { value: "textarea", label: "Long text" },
    { value: "text", label: "Short text" },
    {value:"rating",label:"Rating"}
]

const CreateRequestPage = () => {
    const navigate = useNavigate()
    
    const { register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState:{errors,isSubmitting}
     } = useForm<CreateRequestFormData>({
        resolver: zodResolver(createRequestSchema),
        defaultValues: {
            title: "",
            questions: DEFAULT_QUESTIONS,
            theme: "light",
            allowAnonymous: false,
            expiresAt:null
        }
     })
    
    const { fields,append,remove} = useFieldArray({
        control,
        name:"questions"
    })

    const watchedTheme = watch("theme")
    const watchedAnonymous = watch("allowAnonymous");
    const watchedQuestions = watch("questions");

    const onSubmit = async (data: CreateRequestFormData) => {
        try {
            const res = await createRequestApi(data)
            toast.success("Testimonial request created!")
            navigate(`/dashboard/requests/${res.data.data?._id}`)
        } catch (err:any) {
            toast.error(err?.response?.data?.message ?? "Failed to create request. Try again.")
        }
    }
  return (
      <div className="space-y-6">
          {/* Header */}

          <div className="flex items-center gap-3">
              <Button variant="outline"
                  size="sm"
                  onClick={()=>navigate("/dashboard/requests")}
              >
                  <ArrowLeft className="h-4 w-4"/>
              </Button>

              <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                      New request
                  </h1>

                  <p className="mt-1 text-sm text-text-secondary">
                      Create a shareable link to collect testimonials.
                  </p>
              </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                  {/* Left col main settings */}
                  <div className="space-y-6 lg:col-span-2">
                      {/* Basic info */}
                      <Card className="border-border bg-surface">
                          <CardHeader>
                              <CardTitle className="text-base">Basic info</CardTitle>
                              <CardDescription>
                                  Give your request a name your clients will see.
                              </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-4">
                              <div className="space-y-1.5">
                                  <Label htmlFor="title">Request title</Label>
                                  <Input
                                      id="title"
                                      placeholder="e.g. Feedback from web design project"
                                        className="placeholder:text-sm"
                                      {...register("title")}
                                  />
                                  {errors.title && (
                                      <p className="text-xs text-error">
                                          {errors.title.message}
                                      </p>
                                  )}
                              </div>
                          </CardContent>
                      </Card>


                      {/* Questions */}
                      <Card className="border-border bg-surface">
                          <CardHeader>
                              <div className="flex items-center justify-between">
                                  <div>
                                      <CardTitle className="text-base">
                                          Questions
                                      </CardTitle>

                                      <CardDescription className="mt-1">
                                          Add up to 8 questions. Your client will answer these.
                                      </CardDescription>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                      {fields.length}/8
                                  </Badge>
                              </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                              {fields.map((field, index) => (
                                  <div
                                      key={field.id}
                                      className="rounded-md border border-border bg-card p-4"
                                  >
                                      <div className="flex items-start gap-3">
                                          <GripVertical className="mt-2.5 h-4 w-4 shrink-0 text-text-muted" />
                                          
                                          <div className="flex-1 space-y-3">
                                              {/* Questions text */}
                                              <div className="space-y-1.5">
                                                  <Label className="text-xs text-text-secondary">
                                                      Question {index+1}
                                                  </Label>

                                                  <Input
                                                      placeholder="Type your question here..."
                                                      {...register(`questions.${index}.question`)}
                                                  />

                                                  {errors.questions?.[index]?.question && (
                                                      <p className="text-xs text-error">
                                                          {errors.questions[index]?.question?.message}
                                                      </p>
                                                  )}
                                              </div>

                                              {/* Type selector and required toggle */}

                                              <div className="flex items-center gap-3">
                                                  <div className="flex gap-1">
                                                      {QUESTION_TYPES.map(({ value, label }) => (
                                                          <button
                                                              key={value}
                                                              type="button"
                                                              onClick={() =>
                                                                  setValue(
                                                                      `questions.${index}.type`,
                                                                      value as "text" | "textarea"|"rating"
                                                                  )
                                                              }
                                                              className={`rounded px-2.5 py-1  text-xs transition ${watchedQuestions[index]?.type===value ? "bg-text-primary text-background":"bg-background text-text-secondary border border-border hover:bg-surface"}`}
                                                          >
                                                            {label}  
                                                          </button>
                                                      ))}
                                                  </div>

                                                  <button
                                                      type="button"
                                                      onClick={() =>
                                                          setValue(
                                                              `questions.${index}.required`,
                                                              !watchedQuestions[index]?.required
                                                          )
                                                      }
                                                      className={`ml-auto rounded px-2.5 py-1 text-xs transition ${watchedQuestions[index]?.required ? "bg-success/10 text-success border border-success/20":"bg-background text-text-muted border border-border"}`}
                                                  >
                                                      {watchedQuestions[index]?.required ? "Required":"Optional"}
                                                  </button>
                                              </div>
                                          </div>

                                          {/* Remove */}
                                          {fields.length > 1 && (
                                              <button
                                                  type="button"
                                                  onClick={() => remove(index)}
                                                  className="mt-1 text-text-muted transition hover:text-error"
                                              >
                                                  <Trash2 className="h-4 w-4"/>
                                              </button>
                                          )}
                                      </div>
                                  </div>
                              ))}

                              {fields.length < 8 && (
                                  <button
                                      type="button"
                                      onClick={() =>
                                          append({
                                              question: "",
                                              required: true,
                                              type:"textarea"
                                          })
                                      }
                                      className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-3 text-sm text-text-secondary transition hover:border-text-muted hover:text-text-primary"
                                  >
                                      <Plus className="h-4 w-4" />
                                      Add question
                                  </button>
                              )}

                              {errors.questions?.root && (
                                  <p className="text-xs text-error">
                                      {errors.questions.root.message}
                                  </p>
                              )}

                              {/* Warning after 5 questions */}
                              {fields.length > 5 && (
                                  <p className="text-xs text-warning">
                                      More than 5 questions may reduce completion rates.
                                  </p>
                              )}
                          </CardContent>
                      </Card>
                  </div>

                  {/* Right col settings */}
                  <div className="space-y-4">
                      <Card className="border-border bg-surface">
                          <CardHeader>
                              <CardTitle className="text-base">Settings</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              {/* Theme */}
                              <div className="space-y-2">
                                  <Label className="text-sm">Form theme</Label>
                                  <div className="flex gap-2">
                                      {(["light", "dark"] as const).map((t) => (
                                          <button
                                              key={t}
                                              type="button"
                                              onClick={() => setValue("theme", t)}
                                              className={`flex-1 rounded-md border py-2 text-sm capitalize transition ${watchedTheme===t ? "border-text-primary bg-card text-text-primary":"border-border text-text-secondary hover:bg-card"}`}
                                          >
                                              {t}
                                          </button>
                                      ))}
                                  </div>
                              </div>

                              <Separator className="bg-border" />
                              
                              {/* Anonymous */}

                              <div className="flex items-center justify-between">
                                  <div>
                                      <p className="text-sm text-text-primary">
                                          Allow anonymous
                                      </p>

                                      <p className="text-xs text-text-muted">
                                          Client can skip email
                                      </p>
                                  </div>

                                  <button
                                      type="button"
                                      onClick={() => setValue("allowAnonymous", !watchedAnonymous)}
                                      className={`relative h-5 w-9 rounded-full transition ${watchedAnonymous ? "bg-text-primary":"bg-border"}`}
                                  >
                                      
                                      <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${watchedAnonymous ? "translate-x-4":"translate-x-0"}`}></span>
                                  </button>
                              </div>

                              <Separator className="bg-border" />
                              
                              {/* Expiry */}

                              <div className="space-y-1.5">
                                  <Label htmlFor="expiresAt" className="text-sm">
                                      Expiry date{" "}
                                      <span className="text-text-muted">(optional)</span>
                                  </Label>

                                  <Input
                                      id="expiresAt"
                                      type="datetime-local"
                                      {...register("expiresAt")}
                                      className="text-sm"
                                  />

                                  <p className="text-xs text-text-muted">
                                      Link  auto-closes after this date.
                                  </p>
                              </div>
                          </CardContent>
                      </Card>

                      {/* Submit */}
                      <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full"
                      >
                          {isSubmitting ? (
                              <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating...
                              </>
                          ) : (
                                  "Create request"
                          )}
                      </Button>
                  </div>
              </div>
          </form>
    </div>
  )
}

export default CreateRequestPage