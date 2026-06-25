import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Star,Globe,MessageSquareQuote,ChevronLeft,ChevronRight,SlidersHorizontal } from "lucide-react"
import { useDashboardTestimonials } from "@/hooks/useDashboardTestimonials"
import { useRequests } from "@/hooks/useRequests"
import { cn } from "@/lib/utils"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const statusConfig = {
    PENDING:{label:"Pending",className:"border-warning/20 bg-warning/10 text-warning"},
    APPROVED:{label:"Approved",className:"border-success/20 bg-success/10 text-success"},
    REJECTED:{label:"Rejected",className:"border-error/20 bg-error/10 text-error"},
} as const

const STATUS_OPTIONS = [
    {value:"all",label:"All status"},
    {value:"PENDING",label:"Pending"},
    {value:"APPROVED",label:"Approved"},
    {value:"REJECTED",label:"Rejected"},
]

const SORT_OPTIONS = [
    {value:"createdAt-desc",label:"Newest first"},
    {value:"createdAt-asc",label:"Oldest first"},
    {value:"rating-desc",label:"Highest rated"},
    {value:"rating-asc",label:"Lowest rated"},
]

const LIMIT = 10;

const TestimonialsPage = () => {
    const { requests, isLoading: isLoadingRequests } = useRequests()
    
    const [statusFilter, setStatusFilter] = useState<"all" | "PENDING" | "REJECTED" | "APPROVED">("all")
    const [requestFilter, setRequestFilter] = useState<string>("all")
    const [publishedFilter, setPublishedFilter] = useState<"all" | "true" | "false">("all")
    const [sort, setSort] = useState("createdAt-desc")
    const [page, setPage] = useState(1)
    
    const [sortBy, order] = useMemo(() => {
        const [by, ord] = sort.split("-") as ["createdAt" | "rating" , "asc" | "desc"]
        return [by, ord];
    }, [sort])
    
    const filters = useMemo(
        () => ({
            status: statusFilter !== "all" ? statusFilter : undefined,
            isPublished: publishedFilter !== "all" ? publishedFilter === "true" : undefined,
            requestId: requestFilter !== "all" ? requestFilter : undefined,
            page,
            limit: LIMIT,
            sortBy,
            order
        }),
        [statusFilter, publishedFilter, requestFilter, page, sortBy, order]
    )

    const { testimonials, pagination, isLoading, error } = useDashboardTestimonials(filters)
 
    const resetFiltersAndPage = (fn: () => void) => {
        fn();
        setPage(1);
    }

    if (isLoadingRequests) {
        return (
             <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full"/>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Testimonials</h1>
                <p className="mt-1 text-sm text-text-secondary">
                    All submissions across every request.
                </p>
            </div>

            {/* filters */}

            <Card className="border-border bg-surface">
                <CardContent className="flex flex-wrap items-center gap-3 p-4">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </div>

                    <Select value={statusFilter}
                        onValueChange={(v)=>resetFiltersAndPage(()=>setStatusFilter(v as "all" | "PENDING" | "APPROVED" | "REJECTED"))}
                    >
                        <SelectTrigger className="h-9 w-full sm:w-36">
                            <SelectValue/>
                        </SelectTrigger>

                        <SelectContent>
                            {STATUS_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={requestFilter}
                        onValueChange={(v)=> resetFiltersAndPage(()=>setRequestFilter(v))}
                    >
                        <SelectTrigger className="h-8 w-full sm:w-44">
                            <SelectValue placeholder="All requests"/>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All requests</SelectItem>
                            {requests.map((r) => (
                                <SelectItem key={r._id} value={r._id}>
                                    {r.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={publishedFilter}
                        onValueChange={(v)=>resetFiltersAndPage(()=>setPublishedFilter(v as "all" | "true" | "false"))}
                    >
                        <SelectTrigger className="h-9 w-full sm:w-36">
                            <SelectValue/>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="true">Published</SelectItem>
                            <SelectItem value="false">Not published</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="h-9 w-full sm:w-40 sm:ml-auto">
                            <SelectValue/>
                        </SelectTrigger>

                        <SelectContent>
                            {SORT_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>


            {/* error state */}
            {error && (
                <Card className="border-error/30 bg-error/5">
                    <CardContent className="py-8 text-center text-error">
                        Failed to load testimonials. Please try again.
                    </CardContent>
                </Card>
            )}

            {/* List */}

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full"/>
                    ))}
                </div>
            ): testimonials.length===0 ? (
                    <Card className="border-border bg-surface">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <MessageSquareQuote className="mb-3 h-8 w-8 text-text-muted" />
                            <p className="text-sm font-medium text-text-primary">No testimonials found</p>
                            <p className="mt-1 text-sm text-text-secondary">Try adjusting your filters.</p>
                        </CardContent>
                </Card>
                ) : (
                        <div className="space-y-3">
                            {testimonials.map((t) => {
                                const status = statusConfig[t.status as keyof typeof statusConfig]
                                const request = typeof t.request === "object" ? t.request : null;
                                

                                return (
                                    <Link key={t._id} to={`/dashboard/testimonials/${t._id}`} className="block">
                                        <Card className="border-border bg-surface transition hover:border-text-muted overflow-hidden">
                                            <CardContent className="flex items-center gap-3 p-4">
                                                {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-sm font-medium text-text-primary">
                                                    {t.clientName?.charAt(0)?.toUpperCase() || "?"}
                                                </div> */}
                                                <Avatar className="h-10 w-10">
                                                                          <AvatarImage src={t.clientAvatar ?? undefined} />
                                                                          <AvatarFallback className="text-base">
                                                                              {t.clientName.charAt(0).toUpperCase()}
                                                                          </AvatarFallback>
                                                                      </Avatar>
                                                

                                                <div className="min-w-0 flex-1 overflow-hidden">
                                                    <div className="flex items-center gap-2">
                                                        <p className="truncate font-medium text-text-primary">
                                                            {t.clientName}
                                                        </p>
                                                        {t.clientCompany && (
                                                            <span className="shrink-0  text-text-muted">
                                                               · {t.clientCompany}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-0.5 truncate text-xs text-text-secondary">
                                                        {request?.title ?? "Testimonial request"}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="hidden xs:flex items-center gap-0.5 text-info">
                                                    {Array.from({ length: Math.floor(t.rating || 0) }).map((_, i) => (
                                                        <Star key={i} className="h-3.5 w-3.5 fill-current"/>
                                                    ))}
                                                </div>

                                                {t.isPublished && (
                                                    <Badge variant="outline" className="hidden sm:flex  border-info/20 bg-info/10 text-xs text-info whitespace-nowrap">
                                                        <Globe className="mr-1 h-3 w-3" />
                                                        Live
                                                    </Badge>
                                                )}
                                                {status && (
                                                    <Badge variant="outline"
                                                        className={cn("shrink-0 text-xs whitespace-nowrap",status.className)}
                                                    >
                                                        {status.label}
                                                    </Badge>
                                                )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                )
                            })}
                        </div>
            )}

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-text-muted">
                        Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!pagination.hasPrevPage}
                            onClick={()=>setPage((p)=>Math.max(1,p-1))}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!pagination.hasNextPage}
                            onClick={()=>setPage((p)=>p+1)}
                        >
                            Next
                            <ChevronRight className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            )}
    </div>
  )
}

export default TestimonialsPage