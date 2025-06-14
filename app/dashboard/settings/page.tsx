"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { AlertTriangle, User, Bell, Shield, Trash2, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      
      // Delete the user account first
      const { error: deleteError } = await supabase.rpc('delete_user_account')
      if (deleteError) throw deleteError
      
      // Sign out the user after successful deletion
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      
          // Clear any local storage if needed
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      // Redirect to home page
      window.location.href = '/'
      // The window.location.href will cause a full page reload, ensuring all auth state is cleared
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please try again.')
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 bg-[#fdf8f5] min-h-screen p-6 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Settings</h1>
          {/* <Button className="bg-blue-900 hover:bg-blue-800 text-white">Manage your account and preferences</Button> */}
        </div>

        {/* <!-- Profile Settings -->
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  defaultValue="John" 
                  className="bg-white border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  defaultValue="Doe" 
                  className="bg-white border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue="john.doe@example.com"
                className="bg-white border-gray-200 focus-visible:ring-blue-500"
              />
            </div>
            <Separator />
            <Button className="bg-blue-900 hover:bg-blue-800 text-white">Save Changes</Button>
          </CardContent>
        </Card>

        <!-- Notifications -->
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="learning-reminders" className="text-base">
                  Learning Reminders
                </Label>
                <p className="text-sm text-muted-foreground">Daily reminders to continue learning</p>
              </div>
              <Switch id="learning-reminders" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ai-insights" className="text-base">
                  AI Insights
                </Label>
                <p className="text-sm text-muted-foreground">Notifications about new AI insights</p>
              </div>
              <Switch id="ai-insights" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <!-- Privacy -->
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Privacy</CardTitle>
            </div>
            <CardDescription>Control your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-collection" className="text-base">
                  Data Collection
                </Label>
                <p className="text-sm text-muted-foreground">Allow collection of learning analytics</p>
              </div>
              <Switch id="data-collection" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-profile" className="text-base">
                  Public Profile
                </Label>
                <p className="text-sm text-muted-foreground">Make your learning progress visible to others</p>
              </div>
              <Switch id="public-profile" />
            </div>
          </CardContent>
        </Card>
        

        {/* Danger Zone */}
        <Card className="border-destructive/50 bg-[#fdf8f5]">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </div>
            <CardDescription>Irreversible actions that will permanently affect your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
              </div>
              <Button 
                variant="destructive" 
                onClick={(e) => {
                  e.preventDefault()
                  setShowDeleteDialog(true)
                }}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="pt-4">
                <p className="text-base font-medium text-gray-900 mb-2">Are you sure you want to delete your account?</p>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. This will permanently delete your account and all associated data.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : 'Delete Account'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}
