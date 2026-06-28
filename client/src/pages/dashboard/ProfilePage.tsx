import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner"
import { Loader2, Upload, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { updateProfileApi, changePasswordApi, deleteAccountApi, uploadAvatarApi } from "@/api/user.api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


import { profileSchema, passwordSchema } from "@/validations/user.validation";
import axios from "axios";

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>



const ProfilePage = () => {
    const { user, setUser, logout } = useAuth()
    const navigate = useNavigate()
    
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deletePassword, setDeletePassword] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState:{errors:profileErrors,isSubmitting:isProfileSubmitting,isDirty:isProfileDirty}
     } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues:{name:user?.name ?? ""}
     })
    
    const onProfileSubmit = async (data: ProfileFormData) => {
        try {
            const res = await updateProfileApi(data)
            setUser(res.data.data ?? null)
            toast.success("Profile updated")
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message ?? "Failed to update profile")
            }
        }
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be under 2MB")
            return
        }

        setIsUploadingAvatar(true)
        try {
            const res = await uploadAvatarApi(file)
            setUser(res.data.data ?? null)
            toast.success("Avatar updated")
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message ?? "Failed to upload avatar")
            }
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPasswordForm,
        formState:{errors:passwordErrors,isSubmitting:isPasswordSubmitting}
    } = useForm<PasswordFormData>({
        resolver:zodResolver(passwordSchema)
    })

    const onPasswordSubmit = async (data: PasswordFormData) => {
        try {
            await changePasswordApi(data)
            toast.success("Password changed. Please log in again.")
            resetPasswordForm()
            await logout()
            navigate("/login")
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message ?? "Failed to change password")
            }
        }
    }

    const handleDeleteAccount = async () => {
        setDeleteError(null)
        setIsDeleting(true)
        try {
            await deleteAccountApi(deletePassword)
            toast.success("Account deleted")
            navigate("/")
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                setDeleteError(err?.response?.data?.message ?? "Failed to delete account")
            }
        } finally {
            setIsDeleting(false)
        }
    }

    const initials=user?.name?.split(" ").map((n)=>n[0]).slice(0,2).join("").toUpperCase()
  return (
      <div className="mx-auto max-w-2xl space-y-6">
          <div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                  Profile
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                  Manage your account settings.
              </p>
          </div>

          {/* avatar name */}
          <Card className="border-border bg-surface">
              <CardHeader>
                  <CardTitle className="text-base">
                      Profile information
                  </CardTitle>
              </CardHeader>

              <CardContent>
                  <div className="flex items-center gap-4">
                      <div className="relative">
                          <Avatar className="h-16 w-16">
                              <AvatarImage src={user?.avatar} alt={user?.name}/>
                              <AvatarFallback className="text-lg">{ initials}</AvatarFallback>
                          </Avatar>

                          <label className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center bg-text-primary rounded-full text-background transition hover:bg-accent-hover ">
                              
                              {isUploadingAvatar ? (
                                  <Loader2 className="h-3 w-3 animate-spin"/>
                              ) : (
                                      <Upload className="h-3 w-3"/>
                              )}

                              <input type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  className="hidden"
                                  onChange={handleAvatarChange}
                                  disabled={isUploadingAvatar}
                              />
                          </label>
                      </div>

                      <div>
                          <p className="text-sm font-medium text-text-primary">
                              {user?.name}
                          </p>
                          <p className="text-sm text-text-muted">{user?.email}</p>
                      </div>
                  </div>

                  <Separator className="my-5 bg-border" />
                  
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                      <div className="space-y-1.5">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" {...registerProfile("name")} />
                          {profileErrors.name && (
                              <p className="text-xs text-error">{profileErrors.name.message}</p>
                          )}
                      </div>

                      <div className="space-y-1.5">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={user?.email} disabled />
                          <p className="text-xs text-text-muted">Email cannot be changed</p>
                      </div>

                      <Button
                          type="submit"
                          disabled={isProfileSubmitting || !isProfileDirty}
                          size="sm"
                      >
                          {isProfileSubmitting ? (
                              <Loader2 className="h-4 w-4 animate-spin"/>
                          ) : (
                                  "Save changes"
                          )}
                      </Button>
                  </form>
              </CardContent>
          </Card>

          {/* change password */}
          <Card className="border-border bg-surface">
              <CardHeader>
                  <CardTitle className="text-base">Change Password</CardTitle>
                  <CardDescription>
                      You'll be logged out of all devices after changing your password.
                  </CardDescription>
              </CardHeader>

              <CardContent>
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                      <div className="space-y-1.5">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                              <Input
                                  id="currentPassword"
                                  type={showCurrentPassword ? "text" : "password"}
                                  className="pr-10"
                                  {...registerPassword("currentPassword")}
                              />

                              <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword((v) => !v)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                                  tabIndex={-1}
                              >
                                  {showCurrentPassword ? <EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}
                              </button>
                          </div>

                          {passwordErrors.currentPassword && (
                              <p className="text-xs text-error">
                                  {passwordErrors.currentPassword.message}
                              </p>
                          )}
                      </div>

                      <div className="space-y-1.5">
                           <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                              <Input
                                  id="newPassword"
                                  type={showNewPassword ? "text" : "password"}
                                  className="pr-10"
                                  {...registerPassword("newPassword")}
                              />

                              <button
                                  type="button"
                                  onClick={() => setShowNewPassword((v) => !v)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                                  tabIndex={-1}
                              >
                                  {showNewPassword ? <EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}
                              </button>
                          </div>

                          {passwordErrors.newPassword && (
                              <p className="text-xs text-error">
                                  {passwordErrors.newPassword.message}
                              </p>
                          )}
                      </div>

                      <div className="space-y-1.5">
                           <Label htmlFor="confirmPassword">Confirm new password</Label>
                       
                              <Input
                                  id="confirmPassword"
                                  type="password"
                                  {...registerPassword("confirmPassword")}
                              />
                         
                          {passwordErrors.confirmPassword && (
                              <p className="text-xs text-error">
                                  {passwordErrors.confirmPassword.message}
                              </p>
                          )}
                      </div>

                      <Button type="submit" disabled={isPasswordSubmitting} size="sm">
                          {isPasswordSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin"/>
                          ) : (
                                  "Change password"
                          )}
                      </Button>
                  </form>
              </CardContent>
          </Card>


          {/* danger zone */}

          <Card className="border-error/30 bg-surface">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-error">
                      <AlertTriangle className="h-4 w-4" />
                      Danger zone
                  </CardTitle>

                  <CardDescription>
                      Permanently delete your account and all associated data. This cannot be undone
                  </CardDescription>
              </CardHeader>
              
              <CardContent>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDeleteOpen(true)}
                      className="border-error/30 text-error hover:bg-error/10 hover:text-error"
                  >
                      Delete account
                  </Button>
              </CardContent>
          </Card>

          {/* delete confirmation */}
          <AlertDialog open={isDeleteOpen} onOpenChange={(open) => {
              setIsDeleteOpen(open)
              if (!open) {
                  setDeletePassword("")
                  setDeleteError(null)
              }
          }}>
              <AlertDialogContent className="bg-black ring-0">
                  <AlertDialogHeader>
                      <AlertDialogTitle>
                          Delete your account?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                          This will permanently delete your account, all testimonial requests, responses, and widget settings. This action cannot be undone.
                      </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="space-y-1.5">
                      <Label htmlFor="deletePassword" className="text-sm">
                          Enter your password to confirm
                      </Label>

                      <Input
                          id="deletePassword"
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="*******"
                      />
                      {deleteError && (
                          <p className="text-xs text-error">
                              {deleteError}
                          </p>
                      )}
                  </div>

                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                          onClick={(e) => {
                              e.preventDefault()
                              handleDeleteAccount()
                          }}
                          disabled={isDeleting || !deletePassword}
                          className="bg-error text-white hover:bg-error/90"
                      >
                          {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin"/>
                          ) : (
                                  "Delete my account"
                          )}
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
    </div>
  )
}

export default ProfilePage