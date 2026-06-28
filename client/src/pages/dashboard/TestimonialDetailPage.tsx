import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import useSWR from "swr"
import { toast } from "sonner"

import { ArrowLeft,Star,CheckCircle2,XCircle,Globe,Trash2,Loader2,Pencil,Mail,Building2,Feather,ExternalLink } from "lucide-react"
import { getResponseByIdApi } from "@/api/response.api"
import { approveResponse,rejectResponse,togglePublishResponse,deleteResponse } from "@/hooks/useResponses"

import type { ITestimonialRequest } from "@/types"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog"
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle } from "@/components/ui/alert-dialog"
import axios from "axios"

const statusConfig = {
    PENDING:{label:"Pending",className:"border-warning/20 bg-warning/10 text-warning"},
    APPROVED:{label:"Approved",className:"border-success/20 bg-success/10 text-success"},
    REJECTED:{label:"Rejected",className:"border-error/20 bg-error/10 text-error"}
}

const TestimonialDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
    
    const {data:response,isLoading,mutate}=useSWR(
        id ? `/responses/${id}` : null,
        async()=> (await getResponseByIdApi(id!)).data.data
    )


    const [editedText, setEditedText] = useState("");
    const [isApproveOpen, setIsApproveOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    

    const openApproveDialog = () => {
        if (!response) return;

        const latestDraft =
            response.approvedTestimonial || response.generatedTestimonials[response.generatedTestimonials.length - 1]?.content || ""
        
        setEditedText(latestDraft)
        setIsApproveOpen(true)
    }

    const handleApprove = async () => {
        if (!response) return
        setActionLoading(true)

        try {
            await approveResponse(response._id, editedText)
            toast.success("Testimonial approved")
            mutate()
            setIsApproveOpen(false)
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message ?? "Failed to approve")
            }
        } finally {
            setActionLoading(false)
        }
    }

    const handleReject = async () => {
        if (!response) return;

        setActionLoading(true)

        try {
            await rejectResponse(response._id)
            toast.success("Testimonial rejected")
            mutate()
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message ?? "Failed to reject")
            }
        } finally {
            setActionLoading(false)
        }
    }

    const handleTogglePublish = async () => {
        if (!response) return;
        setActionLoading(true)
        try {
            const res = await togglePublishResponse(response._id)
            toast.success(res.data.data?.isPublished ? "Published to widget" : "Unpublished")
            mutate()
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message ?? "Failed to update")
            }
        } finally {
            setActionLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!response) return;
        setActionLoading(true)
        try {
            await deleteResponse(response._id)
            toast.success("Response deleted")
            navigate("/dashboard/testimonials")
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message ?? "Failed to delete")
            }

            setActionLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full"/>
            </div>
        )
    }

    if (!response) return null
    
    const status = statusConfig[response.status]
    const request=typeof response.request==="object" ? (response.request as ITestimonialRequest) : null
  return (
      <div className="mx-auto max-w-3xl space-y-6">
          {/* header */}

          <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4"/>
              </Button>

              <div className="flex-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                      Testimonial detail
                  </h1>

                  {request && (
                      <Link
                          to={`/dashboard/requests/${request._id}`}
                          className="mt-1 flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
                      >
                          {request.title}
                         <ExternalLink className="h-3 w-3"/> 
                      </Link>
                  )}
              </div>

              <div className="flex items-center gap-2">
                  {response.isPublished && (
                      <Badge variant="outline" className="border-info/20 bg-info/10 text-xs text-info">
                          <Globe className="mr-1 h-3 w-3" />
                          Live
                      </Badge>
                  )}
                  <Badge variant="outline" className={cn("text-xs", status.className)}>
                      {status.label}
                  </Badge>
              </div>
          </div>

          <Card className="border-border bg-surface">
              <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14">
                          <AvatarImage src={response.clientAvatar ?? undefined} />
                          <AvatarFallback className="text-base">
                              {response.clientName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                          <p className="text-base font-medium text-text-primary">
                              {response.clientName}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                              {response.clientEmail && (
                                  <span className="flex items-center gap-1.5">
                                      <Mail className="h-3.5 w-3.5" />
                                      {response.clientEmail}
                                  </span>
                              )}

                              {response.clientCompany && (
                                  <span className="flex items-center gap-1.5">
                                      <Building2 className="h-3.5 w-3.5" />
                                      {response.clientCompany}
                                  </span>
                              )}
                          </div>

                          <div className="mt-2 flex items-center gap-0.5 text-info">
                              {Array.from({ length: response.rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-current"/>
                              ))}
                          </div>
                      </div>

                      <p className="text-xs text-text-muted">
                          {new Date(response.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              year:"numeric"
                          })}
                      </p>
                  </div>
              </CardContent>
          </Card>


          {/* current testimonial */}
          <Card className="border-border bg-surface">
              <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-text-primary">
                          {response.approvedTestimonial ?"Approved testimonial":"AI-generated draft"}
                      </p>
                      {!response.approvedTestimonial && (
                          <span className="flex items-center gap-1 text-xs text-text-muted">
                              <Feather className="h-3 w-3" />
                              AI generated
                          </span>
                      )}
                  </div>

                  <div className="rounded-md bg-card p-4">
                      <p className="text-sm leading-relaxed text-text-primary">
                          {response.approvedTestimonial || 
                          response.generatedTestimonials[response.generatedTestimonials.length-1]?.content}
                      </p>
                  </div>

                  {/* actions */}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                      {response.status === "PENDING" && (
                          <>
                              <Button size="sm" onClick={openApproveDialog} disabled={actionLoading}>
                                  <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                                  Approve
                              </Button>
                              <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleReject}
                                  disabled={actionLoading}
                              >
                                  <XCircle className="mr-2 h-3.5 w-3.5"/>
                                  Reject
                              </Button>
                          </>
                      )}

                      {response.status === "APPROVED" && (
                          <>
                              <Button size="sm" variant="outline" onClick={openApproveDialog}>
                                  <Pencil className="mr-2 h-3.5 w-3.5" />
                                  Edit
                              </Button>
                              
                              <Button
                                  size="sm"
                                  variant={response.isPublished ? "outline" : "default"}
                                  onClick={handleTogglePublish}
                                  disabled={actionLoading}
                              >
                                  <Globe className="mr-2 h-3.5 w-3.5" />
                                  { response.isPublished ? "Unpublish":"Publish"}
                              </Button>
                          </>
                      )}

                      {response.status === "REJECTED" && (
                          <p className="text-xs text-text-muted">
                              This testimonial was rejected and won't be published.
                          </p>
                      )}

                      <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsDeleteOpen(true)}
                          className="ml-auto text-error hover:text-error"
                      >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                      </Button>
                  </div>
              </CardContent>
          </Card>

          {/* original answers */}

          <Card className="border-border bg-surface">
              <CardContent className="p-5">
                  <p className="mb-4 text-sm font-medium text-text-primary">
                      Original answers
                  </p>

                  <div className="space-y-4">
                      {response.answers.map((a, i) => (
                          <div key={i}>
                              <p className="text-xs font-medium text-text-secondary">
                                  {a.question}
                              </p>

                              <p className="mt-1 text-sm text-text-primary">
                                  {a.answer}
                              </p>
                              {i < response.answers.length - 1 && (
                                  <Separator className="mt-4 bg-border"/>
                              )}
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>

          {/* generation history */}
          {response.generatedTestimonials.length > 1 && (
              <Card className="border-border bg-surface">
                  <CardContent className="p-5">
                      <p className="mb-4 text-sm font-medium text-text-primary">
                          Draft history
                      </p>

                      <div className="space-y-3">
                          {response.generatedTestimonials.map((draft, i) => (
                              <div key={i} className="rounded-md bg-card p-3">
                                  <div className="mb-1.5 flex items-center justify-between">
                                      <Badge variant="outline" className="text-xs capitalize">
                                          {draft.tone}
                                      </Badge>

                                      <span className="text-xs text-text-muted">
                                          {new Date(draft.createdAt).toLocaleDateString()}
                                        </span>
                                  </div>
                                  <p className="text-sm text-text-secondary">{draft.content}</p>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          )}

          {/* approve / edit dialog */}
          <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen} >
              <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                      <DialogTitle>Review testimonial</DialogTitle>
                  </DialogHeader>

                  <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={6}
                      className="resize-none"
                  />
                  <p className="text-xs text-text-muted">
                      {editedText.length} / 3000 characters
                  </p>

                  <DialogFooter>
                      <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
                          Cancel
                      </Button>
                      <Button onClick={handleApprove} disabled={actionLoading || editedText.trim().length < 20}>
                          {actionLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin"/>
                          ) : (
                                  "Approve testimonial"
                          )}
                      </Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>

          {/* delete confirmation */}
          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <AlertDialogContent className="bg-black ring-0">
                  <AlertDialogHeader>
                      <AlertDialogTitle>Delete this response?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This will permanently delete this testimonial. This cannot be undone.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}
                      className="bg-error text-white hover:bg-error/90"
                      >
                          Delete
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
    </div>
  )
}

export default TestimonialDetailPage