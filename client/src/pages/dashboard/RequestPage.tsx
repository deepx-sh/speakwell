import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Plus, Copy, Check, MoreVertical, Lock, Trash2, ExternalLink, FileText, Users } from "lucide-react"
import { useRequests, closeRequest, deleteRequest } from "@/hooks/useRequests"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle } from "@/components/ui/alert-dialog"

const RequestPage = () => {
    const { requests, isLoading, mutate } = useRequests()
    const [copiedToken, setCopiedToken] = useState<string | null>(null)
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    
    // Copy link
    const handleCopyLink = (token: string) => {
        const url = `${window.location.origin}/r/${token}`
        navigator.clipboard.writeText(url)
        setCopiedToken(token)
        toast.success("Link copied to clipboard")
        setTimeout(()=>setCopiedToken(null),2000)
    }

    // Close request

    const handleClose = async (id: string) => {
        setActionLoading(id)

        try {
            await closeRequest(id)
            toast.success("Request closed")
            mutate()
        } catch (err:any) {
            toast.error(err?.response?.data?.message ?? "Failed to close request")
        } finally {
            setActionLoading(null)
        }
    }

    // Delete request
    
    const handleDelete = async () => {
        if (!requestToDelete) return
        
        setActionLoading(requestToDelete)
        try {
            await deleteRequest(requestToDelete)
            toast.success("Request deleted")
            mutate()
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to delete request")
        } finally {
            setActionLoading(null)
            setRequestToDelete(null)
        }
    }
  return (
      <div className="space-y-6">
          <div className="flex items-center justify-between">
              <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                      Requests
                  </h1>

                  <p className="mt-1 text-sm text-text-secondary">
                      Sharable links that collect testimonials from your clients.
                  </p>
              </div>

              <Link to="/dashboard/requests/new">
                  <Button className="hover:bg-surface hover:cursor-pointer">
                      <Plus className="mr-2 h-4 w-4" />
                      New request
                </Button>
              </Link>
          </div>

          {isLoading ? (
              <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full"/>
                  ))}
              </div>
          ) : requests.length === 0 ? (
                  <Card className="border-border bg-surface">
                      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                          <FileText className="mb-3 h-8 w-8 text-text-muted" />
                          <p className="text-sm font-medium text-text-primary">
                              No requests yet
                          </p>

                          <p className="mt-1 text-sm text-text-secondary">
                              Create your first testimonial request to start collecting feedback.
                          </p>

                          <Link to="/dashboard/requests/new" className="mt-4">
                              <Button className="hover:bg-surface hover:cursor-pointer">
                                  <Plus className="mr-2 h-4 w-4" />
                                  New request
                            </Button>
                          </Link>
                      </CardContent>
                  </Card>
              ) : (
                      <div className="space-y-3">
                          {requests.map((request) => (
                              <Card key={request._id} className="border-border bg-surface">
                                  <CardContent className="p-5">
                                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                          {/* Left info */}
                                          <div className="flex-1">
                                              <div className="flex items-center gap-2">
                                                  <Link to={`/dashboard/requests/${request._id}`} className="text-sm font-medium text-text-primary hover:underline">
                                                    {request.title}
                                                  </Link>

                                                  <Badge
                                                      variant="outline"
                                                      className={cn(
                                                          "text-xs",
                                                          request.status === "ACTIVE"
                                                              ? "border-success/20 bg-success/10 text-success"
                                                              :"border-border bg-card text-text-muted"
                                                      )}
                                                  >
                                                      {request.status==="ACTIVE" ? "Active":"Closed"}
                                                  </Badge>
                                              </div>

                                              <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
                                                  <span className="flex items-center gap-1">
                                                      <Users className="h-3 w-3" />
                                                      {request.submissionCount} submission
                                                      {request.submissionCount!==1 ? "s":""}
                                                  </span>

                                                  <span>{request.questions.length} questions</span>
                                                  {request.allowAnonymous && <span>Anonymous allowed</span>}
                                              </div>
                                          </div>

                                          {/* Right actions */}

                                          <div className="flex items-center gap-2">
                                              <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => handleCopyLink(request.token)}
                                                  disabled={request.status==="CLOSED"}
                                                >
                                                  {copiedToken === request.token ? (
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

                                              <Link to={`/dashboard/requests/${request._id}`}>
                                                  <Button variant="outline" size="sm">
                                                      <ExternalLink className="h-3.5 w-3.5"/>
                                                  </Button>
                                              </Link>


                                              <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                      <Button
                                                          variant="outline"
                                                          size="sm"
                                                          disabled={actionLoading===request._id}
                                                      >
                                                          <MoreVertical className="h-3.5 w-3.5"/>
                                                      </Button>
                                                  </DropdownMenuTrigger>

                                                  <DropdownMenuContent align="end">
                                                      {request.status === "ACTIVE" && (
                                                          <DropdownMenuItem onClick={() => handleClose(request._id)}>
                                                              <Lock className="mr-2 h-4 w-4" />
                                                              Close request
                                                          </DropdownMenuItem>
                                                      )}

                                                      <DropdownMenuItem onClick={() => setRequestToDelete(request._id)} className="text-error">
                                                          <Trash2 className="mr-2 h-4 w-4" />
                                                          Delete
                                                      </DropdownMenuItem>
                                                  </DropdownMenuContent>
                                              </DropdownMenu>
                                          </div>
                                      </div>
                                  </CardContent>
                              </Card>
                          ))}
                      </div>
          )}

          {/* Delete confirmation */}

          <AlertDialog open={!!requestToDelete} onOpenChange={(open) => !open && setRequestToDelete(null)}>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Delete this request?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This will permanently delete this request and all its testimonials. This action cannot be undone.
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

export default RequestPage