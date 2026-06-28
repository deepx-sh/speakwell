import { useState } from "react";
import {  Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner"
import { User, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import SidebarContent from "./SidebarContent";




const DashboardLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    
    const handleLogout = async () => {
        await logout()
        toast.success("Logged out succussfully")
        navigate("/login")
    }

    const initials = user?.name
        ?.split(" ")
        .map((n) => n[0]).
        slice(0, 2)
        .join("")
        .toUpperCase()
  return (
      <div className="flex min-h-screen bg-background">
          {/* Sidebar desktop */}
          <aside className="hidden w-60 flex-col border-r border-border-subtle bg-surface md:flex">
              <SidebarContent onNavigate={()=>{}} />
          </aside>

          {/* Sidebar Mobile overlay */}
          {isMobileSidebarOpen && (
              <div className="fixed inset-0 z-50 md:hidden">
                  <div className="absolute inset-0 bg-black/60"
                    onClick={()=>setIsMobileSidebarOpen(false)}
                  >
                      <aside className="absolute left-0 top-0 h-full w-60 border-r border-border-subtle bg-surface">
                          <SidebarContent onNavigate={()=>setIsMobileSidebarOpen(false)}/>
                      </aside>
                  </div>
              </div>
          )}


          {/* Main content */}
          <div className="flex flex-1 flex-col">
              <header className="flex h-14 items-center justify-between border-b border-border-subtle bg-background px-4 md:px-6">
                  <button
                      onClick={() => setIsMobileSidebarOpen(true)}
                      className="text-text-secondary transition hover:text-text-primary md:hidden"
                  >
                      <Menu className="h-5 w-5"/>
                  </button>

                  <div className="hidden md:block" />
                  
                  {/* User Menu */}

                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-surface hover:cursor-pointer">
                              <Avatar className="h-7 w-7" >
                              <AvatarImage src={user?.avatar} alt={user?.name} />
                              <AvatarFallback className="text-xs">
                                  {initials}
                                  </AvatarFallback>
                              </Avatar>
                              <span className="hidden text-sm text-text-secondary sm:inline">
                                  {user?.name}
                              </span>
                          </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>
                              <div className="flex flex-col">
                                  <span className="text-sm font-medium">{user?.name}</span>
                                  <span className="text-xs text-text-muted">{user?.email}</span>
                              </div>
                          </DropdownMenuLabel>

                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem onClick={() => navigate("/dashboard/profile")} className="cursor-pointer">
                              <User className="mr-2 h-4 w-4" />
                              Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                             <DropdownMenuItem onClick={handleLogout} className="text-error cursor-pointer">
                              <LogOut className="mr-2 h-4 w-4" />
                              Log out
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </header>

              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                  <Outlet/>
              </main>
          </div>
    </div>
  )
}


export default DashboardLayout