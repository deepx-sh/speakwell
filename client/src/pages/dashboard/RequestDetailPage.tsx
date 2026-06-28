import { useState } from "react";
import { useParams, useNavigate, Link} from "react-router-dom";
import { toast } from "sonner"
import { ArrowLeft,Copy,Check,Star,CheckCircle2,XCircle,Globe,Trash2,Loader2,MessageSquareQuote,Pencil } from "lucide-react";
import { useRequestDetail,useResponsesByRequest,approveResponse,rejectResponse,togglePublishResponse,deleteResponse } from "@/hooks/useResponses";
import { cn } from "@/lib/utils";
import type { ITestimonialResponse } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import axios from "axios";

const statusConfig = {
    PENDING:{label:"Pending",className:"border-warning/20 bg-warning/10 text-warning"},
    APPROVED:{label:"Approved",className:"border-success/20 bg-success/10 text-success"},
    REJECTED:{label:"Rejected",className:"border-error/20 bg-error/10 text-error"}
}
const RequestDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
    
    const { request, isLoading:requestLoading } = useRequestDetail(id!)
    const { responses, isLoading: responsesLoading, mutate } = useResponsesByRequest(id!)
    const [copied, setCopied] = useState(false)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    
    const [approveTarget, setApproveTarget] = useState<ITestimonialResponse | null>(null)
    const [editedText, setEditedText] = useState("")
    
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
    
    const handleCopyLink = () => {
        if (!request) return;
        navigator.clipboard.writeText(`${window.location.origin}/r/${request.token}`)
        setCopied(true)
        toast.success("Link copied")
        setTimeout(()=>setCopied(false),2000)
    }

    const openApproveDialog = (response: ITestimonialResponse) => {
        const latestDraft = response.approvedTestimonial || response.generatedTestimonials[response.generatedTestimonials.length - 1]?.content || "";
        setEditedText(latestDraft)
        setApproveTarget(response)
    }

    const handleApprove = async () => {
        if (!approveTarget) return;
        setActionLoading(approveTarget._id)
        try {
            await approveResponse(approveTarget._id, editedText)
            toast.success("Testimonial approved")
            mutate()
            setApproveTarget(null)
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message ?? "Failed to approve")
            }
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (responseId: string) => {
        setActionLoading(responseId)
        try {
            await rejectResponse(responseId)
            toast.success("Testimonial rejected")
            mutate()
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message ?? "Failed to reject")
            }
        } finally {
            setActionLoading(null)
        }
    }

    const handleTogglePublish = async (responseId: string) => {
        setActionLoading(responseId)
        try {
            const res = await togglePublishResponse(responseId)
            toast.success(res.data.data?.isPublished ? "Published to widget" : "Unpublished from widget")
            mutate()
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message ?? "Failed to update")
            }
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setActionLoading(deleteTarget)
        try {
            await deleteResponse(deleteTarget)
            toast.success("Response deleted")
            mutate()
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message || "Failed to delete")
            }
        } finally {
            setActionLoading(null)
            setDeleteTarget(null)
        }
    }

    if (requestLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-64"/>
                <Skeleton className="h-32 w-full"/>
                <Skeleton className="h-48 w-full"/>
            </div>
        )
    }
    if(!request) return null
  return (
      <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                   <Button
                  variant="outline"
                  size="sm"
                  onClick={()=>navigate("/dashboard/requests")}
              >
                  <ArrowLeft className="h-4 w-4"/>
                  </Button>
                   <div>
                  <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                          {request.title}
                      </h1>
                      <Badge
                          variant="outline"
                          className={cn(
                              "text-xs whitespace-nowrap",
                              request.status === "ACTIVE"
                                  ? "border-success/20 bg-success/10 text-success"
                                  :"border-border bg-card text-text-muted"
                          )}
                      >
                          {request.status==="ACTIVE"?"Active":"Closed"}
                          </Badge>
                          
                          <Link to={`/dashboard/requests/${request._id}/edit`}>
                              <Button variant="outline" size="sm">
                                  <Pencil className="mr-2 h-3.5 w-3.5" />
                                  Edit
                              </Button>
                          </Link>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                      {responses.length} submission{responses.length !== 1 ? "s" : ""} ·{" "}
                      {request.questions.length} questions
                  </p>
              </div>
             </div>

             
          </div>


          {/* Share link */}
          <Card className="border-border bg-surface">
              <CardContent className=" p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                      <code className="flex-1 rounded-md bg-card px-3 py-2.5 text-sm text-text-secondary break-all sm:wrap-break-word">
                      {window.location.origin}/r/{request.token}
                  </code>
                  <Button size="sm" onClick={handleCopyLink} className="sm:w-auto w-full">
                      {copied ? (
                          <>
                              <Check className="mr-2 h-3.5 w-3.5" />
                              Copied
                          </>
                      ) : (
                              <>
                                  <Copy className="mr-2 h-3.5 w-3.5" />
                                  Copy link
                              </>
                      )}
                  </Button>
                  </div>
              </CardContent>
          </Card>


          {/* Responses */}
          <div>
              <h2 className="mb-3 text-sm font-medium text-text-primary">
                  Submissions
              </h2>

              {responsesLoading ? (
                  <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, i) => (
                          <Skeleton key={i} className="h-40 w-full"/>
                      ))}
                  </div>
              ) : responses.length === 0 ? (
                      <Card className="border-border bg-surface">
                          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                              <MessageSquareQuote className="mb-3 h-8 w-8 text-text-muted" />
                              <p className="text-sm font-medium text-text-primary">
                                  No submissions yet
                              </p>
                              <p className="mt-1 text-sm text-text-secondary">
                                  Share the link above to start collecting testimonials.
                              </p>
                          </CardContent>
                      </Card>
                  ) : (
                          <div className="space-y-3">
                              {responses.map((response) => {
                                  const status = statusConfig[response.status]
                                  const latestDraft = response.generatedTestimonials[response.generatedTestimonials.length - 1]
                                  
                                  return (
                                      <Card key={response._id} className="border-border bg-surface">
                                          <CardContent className="p-5">
                                              {/* Top row */}
                                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                  <div className="flex items-center gap-3">
                                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-sm font-medium text-text-primary">
                                                          {response.clientName.charAt(0).toUpperCase()}
                                                      </div>
                                                      <div className="min-w-0 flex-1">
                                                          <p className="text-sm font-medium text-text-primary truncate">
                                                              {response.clientName}
                                                          </p>
                                                          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                                                              {response.clientCompany && (
                                                                  <span >{response.clientCompany}</span>
                                                              )}
                                                              <div className="flex items-center gap-0.5 text-info">
                                                                  {Array.from({ length: response.rating }).map((_, i) => (
                                                                      <Star key={i} className="h-3 w-3 fill-current"/>
                                                                  ))}
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>

                                                  <div className="flex items-center gap-2 self-start">
                                                      {response.isPublished && (
                                                          <Badge variant="outline"
                                                            className="border-info/20 bg-info/10 text-xs text-info whitespace-nowrap"
                                                          >
                                                              <Globe className="mr-1 h-3 w-3" />
                                                              Live
                                                          </Badge>
                                                      )}

                                                      <Badge variant="outline" className={cn("text-xs whitespace-nowrap", status.className)}>
                                                          {status.label}
                                                      </Badge>
                                                  </div>
                                              </div>

                                              {/* Testimonial content */}
                                              <div className="mt-4 rounded-md bg-card p-4">
                                                  <p className="text-sm leading-relaxed text-text-primary">
                                                      {response.approvedTestimonial || latestDraft?.content}
                                                  </p>

                                                  {!response.approvedTestimonial && latestDraft && (
                                                      <p className="mt-2 text-xs text-text-muted">
                                                          AI-generated draft · {latestDraft.tone} tone
                                                      </p>
                                                  )}
                                              </div>

                                              {/* Raw answers */}
                                              <details className="mt-3">
                                                  <summary className="cursor-pointer text-xs text-text-secondary hover:text-text-primary">
                                                      View original answers
                                                  </summary>

                                                  <div className="mt-2 space-y-2">
                                                      {response.answers.map((a, i) => (
                                                          <div key={i} className="text-xs">
                                                              <p className="text-text-muted">{a.question}</p>
                                                              <p className="mt-0.5 text-text-secondary">{a.answer}</p>
                                                          </div>
                                                      ))}
                                                  </div>
                                              </details>

                                              {/* Actions */}
                                              <div className="mt-4 flex flex-wrap items-center gap-2">
                                                  {response.status === "PENDING" && (
                                                      <>
                                                          <Button
                                                              size="sm"
                                                              onClick={() => openApproveDialog(response)}
                                                              disabled={actionLoading===response._id}
                                                          >
                                                              <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                                                              Approve
                                                          </Button>

                                                          <Button
                                                              size="sm"
                                                              variant="outline"
                                                              onClick={() => handleReject(response._id)}
                                                              disabled={actionLoading===response._id}
                                                          >
                                                              <XCircle className="mr-2 h-3.5 w-3.5" />
                                                              Reject
                                                          </Button>
                                                      </>
                                                  )}

                                                  {response.status === "APPROVED" && (
                                                      <>
                                                          <Button
                                                              size="sm"
                                                              variant="outline"
                                                              onClick={()=>openApproveDialog(response)}
                                                          >
                                                              <Pencil className="mr-2 h-3.5 w-3.5" />
                                                              Edit
                                                          </Button>

                                                          <Button
                                                              size="sm"
                                                              variant={response.isPublished ? "outline" : "default"}
                                                              onClick={() => handleTogglePublish(response._id)}
                                                              disabled={actionLoading===response._id}
                                                          >
                                                              <Globe className="mr-2 h-3.5 w-3.5" />
                                                              {response.isPublished ? "Unpublish":"Publish"}
                                                          </Button>
                                                      </>
                                                  )}

                                                  <Button
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={() => setDeleteTarget(response._id)}
                                                      className="ml-auto text-error hover:text-error"
                                                  >
                                                      <Trash2 className="h-3.5 w-3.5" />
                                    
                                                  </Button>
                                              </div>
                                          </CardContent>
                                      </Card>
                                  )
                              })}
                          </div>
              )}
          </div>


          {/* Approve / Edit dialog */}
          <Dialog open={!!approveTarget} onOpenChange={(open) => !open && setApproveTarget(null)}>
              <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                      <DialogTitle>Review testimonial</DialogTitle>
                  </DialogHeader>

                  <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={6}
                      placeholder="Edit the testimonial text..."
                      className="resize-none"
                  />

                  <p className="text-xs text-text-muted">
                      {editedText.length} / 3000 characters
                  </p>

                  <DialogFooter>
                      <Button variant="outline" onClick={() => setApproveTarget(null)}>
                          Cancel
                      </Button>
                      <Button
                          onClick={handleApprove}
                          disabled={actionLoading===approveTarget?._id || editedText.trim().length<20}
                      >
                          {actionLoading === approveTarget?._id ? (
                              <Loader2 className="h-4 w-4 animate-spin"/>
                          ) : (
                                  "Approve testimonial"
                          )}
                      </Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
          
          {/* Delete confirmation */}
          <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
              <AlertDialogContent className="bg-black ring-0">
                  <AlertDialogHeader>
                      <AlertDialogTitle>Delete this response?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This will permanently delete this testimonial submission. This cannot be undone.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                          onClick={handleDelete}
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

export default RequestDetailPage