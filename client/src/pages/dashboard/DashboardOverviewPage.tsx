import { Link } from "react-router-dom"
import { FileText,MessageSquareQuote,Clock,CheckCircle2,XCircle,Globe,Star,ArrowRight,Plus } from "lucide-react"
import { useDashboardStats,useRecentActivity } from "@/hooks/useDashboard"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { ITestimonialRequest, ITestimonialResponse } from "@/types"

const statusConfig: Record<ITestimonialResponse["status"], { label: string; className: string }> = {
  PENDING:{label:"Pending",className:"bg-warning/10 text-warning border-warning/20"},
  APPROVED: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  REJECTED:{label:"Rejected",className:"bg-error/10 text-error border-error/20"}
}
const DashboardOverviewPage = () => {
  const { user } = useAuth()
  const { stats, isLoading: statsLoading } = useDashboardStats()
  const { activity, isLoading: activityLoading } = useRecentActivity()
  
  const firstName = user?.name?.split(" ")[0]
  const statCards = [
    {
      label: "Active requests",
      value: stats?.activeRequests,
      total: stats?.totalRequests,
      icon:FileText,
    },
    {
      label: "Total submissions",
      value: stats?.totalSubmissions,
      icon:MessageSquareQuote
    },
    {
      label: "Pending review",
      value: stats?.pendingReview,
      icon: Clock,
      highlight:stats?.pendingReview ? stats.pendingReview >0 :false
    }, {
      label: "Published live",
      value: stats?.published,
      icon:Globe
    }
  ]
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Welcome back{firstName ? `, ${firstName}`:""}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Here's what's happening with your testimonials
          </p>
        </div>

        <Link to="/dashboard/requests/new">
          <Button className="hover:bg-surface hover:cursor-pointer">
            <Plus className="mr-1 h-4 w-4"/>
              New request
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-4">
        {statCards.map(({ label, value, total, icon: Icon, highlight }) => (
          <Card key={label} className="border-border bg-surface">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary">{label}</p>
                <Icon className="h-4 w-4 text-text-muted"/>
              </div>

              {statsLoading ? (
                <Skeleton className="mt-2 h-8 w-16"/>
              ) : (
                  <p className="mt-2 text-2xl font-semibold text-text-primary">
                    {value ?? 0}
                    {total !== undefined && (
                      <span className="ml-1 text-sm font-normal text-text-muted">
                        / {total}
                      </span>
                    )}
                    {
                     highlight && (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-warning" />
                      )
                    }
                  </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Average rating and breakdown */}
      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="border-border bg-surface lg:col-span-1">
          <CardContent className="p-5">
            <p className="text-sm text-text-secondary">Average rating</p>
            {statsLoading ? (
              <Skeleton className="mt-3 h-9 w-24"/>
            ) : (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-3xl font-semibold text-text-primary">
                    {stats?.averageRating ?? 0}
                  </span>
 
                  <div className="flex items-center gap-0.5 text-info">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.round(stats?.averageRating ?? 0)
                            ? "fill-current"
                            : "fill-none text-text-muted"
                        )}
                      />
                    ))}
                  </div>
                </div>
            )}

            <p className="mt-1 text-xs text-text-muted">
              Across all client submissions
            </p>
          </CardContent>
        </Card>


        <Card className="border-border bg-surface lg:col-span-2">
          <CardContent className="p-5">
            <p className="mb-4 text-sm text-text-secondary">
              Testimonial breakdown
            </p>

            {statsLoading ? (
              <Skeleton className="h-9 w-full"/>
            ) : (
                <div className="space-y-3">
                  {[
                    {label:"Approved",value:stats?.approved ?? 0,icon:CheckCircle2,color:"text-success"},
                    {label:"Pending",value:stats?.pendingReview ?? 0,icon:Clock,color:"text-warning"},
                    {label:"Rejected",value:stats?.rejected ?? 0,icon:XCircle,color:"text-error"}
                  ].map(({ label, value, icon: Icon, color }) => {
                    const total = stats?.totalSubmissions || 1;
                    const percent = Math.round((value / total) * 100)
                    
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <Icon className={cn("h-4 w-4 shrink-0", color)} />
                        <span className="w-20 shrink-0 text-sm text-text-secondary">
                          {label}
                        </span>

                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-card">
                          <div className={
                            cn(
                              "h-full rounded-full",
                              label === "Approved" && "bg-success",
                              label === "Pending" && "bg-warning",
                              label==="Rejected" && "bg-error"
                            )
                          }
                            style={{ width: `${percent}%` }}/>
                            </div>
                            <span className="w-8 shrink-0 text-right text-sm text-text-secondary">
                              {value}
                            </span>
                        </div>
                    )
                  })}
                </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border bg-surface">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-text-primary">
              Recent activity
            </p>
            <Link to="/dashboard/testimonials" className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary">
              View all
              <ArrowRight className="h-3 w-3"/>
            </Link>
          </div>

          {activityLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full"/>
              ))}
            </div>
          ) : activity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <MessageSquareQuote className="mb-3 h-8 w-8 text-text-muted" />
                <p className="text-sm text-text-secondary">
                  No submissions yet
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  Share a testimonial request link to get started
                </p>
              </div>
            ) : (
                <div className="space-y-1">
                  {activity.map((item) => {
                    const request = item.request as ITestimonialRequest;
                    const status = statusConfig[item.status]
                    
                    return (
                      <Link
                        key={item._id}
                        to={`/dashboard/testimonials/${item._id}`}
                        className="flex items-center justify-between rounded-md px-2 py-2.5 transition hover:bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-sm font-medium text-text-primary">
                            {item.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {item.clientName}
                            </p>

                            <p className="text-xs text-text-muted">
                              {request?.title ?? "Testimonial request"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-0.5 text-info">
                            {Array.from({ length: item.rating }).map((_, i)=>(
                            <Star key={i} className="h-3 w-3 fill-current"/>
                            ))}
                          </div>
                          <Badge variant="outline" className={(cn("text-xs", status.className))}>
                            {status.label}
                          </Badge>
                        </div>
                      </Link>
                    )
                  })}
                </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardOverviewPage