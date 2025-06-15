"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"

export function DashboardHeader() {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="h-8 w-8" />
          <div className="flex items-center space-x-2">
            <div className="h-6 flex items-center">
              <img 
                src="/logo wordmark.png" 
                alt="Hilight Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications - Commented out
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-semibold">Notifications</h4>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
                    Mark all as read
                  </Button>
                )}
              </div>
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex-col items-start p-4 space-y-2 cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm">{notification.title}</span>
                        {notification.unread && (
                          <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full bg-blue-500"></Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    </DropdownMenuItem>
                  ))}
                  <Separator />
                  <DropdownMenuItem className="text-center text-sm text-muted-foreground justify-center">
                    Show all notifications
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">No new notifications</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          */}

          {/* Sign Out Button */}
          <Button variant="ghost" asChild>
            <Link href="/login">Sign Out</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
