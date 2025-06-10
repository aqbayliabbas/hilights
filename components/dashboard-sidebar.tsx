"use client"

import { Plus, Settings, MessageCircle, Clock } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Mock data for recent conversations
const recentConversations = [
  {
    id: "1",
    title: "React Hooks Tutorial",
    lastMessage: "Great explanation of useState and useEffect...",
    timestamp: "2 hours ago",
    isActive: true,
  },
  {
    id: "2",
    title: "JavaScript Fundamentals",
    lastMessage: "The async/await section was really helpful...",
    timestamp: "1 day ago",
    isActive: false,
  },
  {
    id: "3",
    title: "CSS Grid Layout",
    lastMessage: "Now I understand grid-template-areas...",
    timestamp: "3 days ago",
    isActive: false,
  },
]

export function DashboardSidebar() {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Hilight</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <Plus className="h-4 w-4" />
                    <span>New Conversation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Conversations */}
        <SidebarGroup>
          <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentConversations.length > 0 ? (
  recentConversations.map((conversation) => (
    <SidebarMenuItem key={conversation.id}>
      <SidebarMenuButton
        asChild
        isActive={conversation.isActive}
        className="flex-col items-start h-auto py-3"
      >
        <Link href={`/dashboard/conversation/${conversation.id}`}>
          <div className="flex items-center space-x-2 w-full">
            <MessageCircle className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium truncate">{conversation.title}</span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))
) : (
  <div className="px-3 py-4 text-sm text-gray-500 text-center">No recent conversations.</div>
)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500 text-center">© 2024 Hilight</div>
      </SidebarFooter>
    </Sidebar>
  )
}
