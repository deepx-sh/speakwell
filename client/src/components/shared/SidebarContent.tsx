import { cn } from "@/lib/utils"
import { Code2, FileText, LayoutDashboard, MessageSquareQuote, Sparkles, X } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import { Button } from "../ui/button"

const navItems = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/dashboard/requests",label:"Requests",icon:FileText},
    { to: "/dashboard/testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { to: "/dashboard/widget", label: "Widget", icon: Code2 },
]

const SidebarContent = ({onNavigate}:{onNavigate:()=>void}) => {
  return (
      <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-between border-b border-border-subtle px-4">
              <Link to="/" className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-text-primary">
                      <Sparkles className="h-4 w-4 text-background"/>
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                      Speakwell
                  </span>
              </Link>

              <button
                  onClick={onNavigate}
                  className="text-text-secondary transition hover:text-text-primary md:hidden"
              >
                  <X className="h-5 w-5"/>
              </button>
          </div>

          {/* Nav links */}

          <nav className="flex-1 space-y-1 p-3">

              {navItems.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                      key={to}
                      to={to}
                      end={end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                          cn(
                              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition",
                              isActive ? "bg-card text-text-primary":"text-text-secondary hover:bg-card hover:text-text-primary"
                        )
                    }
                  >
                      <Icon className="h-4 w-4" />
                      {label}
                  </NavLink>
              ))}
          </nav>

          {/* Create request CTA */}
          <div className="border-t border-border-subtle p-3">
              <Link to="/dashboard/requests/new" onClick={onNavigate}>
                  <Button className="w-full hover:bg-card hover:cursor-pointer" size="sm">
                      New testimonial request
                </Button>
              </Link>
          </div>
    </div>
  )
}

export default SidebarContent