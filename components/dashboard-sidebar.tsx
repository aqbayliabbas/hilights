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

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

import { useRouter } from "next/navigation";

export function DashboardSidebar() {
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  // Listen for route changes to show skeleton
  useEffect(() => {
    const handleStart = (url: string) => {
      if (url === "/dashboard/settings") {
        setIsNavigating(true);
      }
    };
    const handleComplete = () => {
      setIsNavigating(false);
    };
    // For Next.js app router, use router.events if available, else fallback
    // But in app directory, router.events is not available, so we use a workaround
    // Listen to window 'next/navigation' events
    window.addEventListener('routeChangeStart', (e: any) => handleStart(e.detail));
    window.addEventListener('routeChangeComplete', handleComplete);
    window.addEventListener('routeChangeError', handleComplete);
    return () => {
      window.removeEventListener('routeChangeStart', (e: any) => handleStart(e.detail));
      window.removeEventListener('routeChangeComplete', handleComplete);
      window.removeEventListener('routeChangeError', handleComplete);
    };
  }, []);

  useEffect(() => {
    async function fetchConversations() {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('id, youtube_title, created_at')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setRecentConversations(data);
      } else {
        setRecentConversations([]);
      }
      setLoading(false);
    }
    fetchConversations();
  }, []);

  return (
    <Sidebar className="border-r border-gray-200">
      {isNavigating ? (
        <>
          {/* Skeleton Header */}
          <SidebarHeader className="p-4">
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-8 h-8 bg-gray-300 rounded-lg" />
              <div className="h-6 w-24 bg-gray-300 rounded" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            {/* Skeleton Quick Actions */}
            <SidebarGroup>
              <SidebarGroupLabel>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[1,2].map((i) => (
                    <SidebarMenuItem key={i}>
                      <div className="flex items-center space-x-2 animate-pulse px-2 py-1.5 rounded">
                        <div className="h-4 w-4 bg-gray-300 rounded" />
                        <div className="h-4 w-20 bg-gray-300 rounded" />
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {/* Skeleton Recent Conversations */}
            <SidebarGroup>
              <SidebarGroupLabel>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[1,2,3].map((i) => (
                    <SidebarMenuItem key={i}>
                      <div className="flex items-center space-x-2 animate-pulse px-2 py-1.5 rounded">
                        <div className="h-4 w-4 bg-gray-300 rounded" />
                        <div className="h-4 w-28 bg-gray-300 rounded" />
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 text-xs">
            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
          </SidebarFooter>
        </>
      ) : (
        <>
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
                  {loading ? (
  <div className="px-3 py-4 text-sm text-gray-500 text-center">Loading...</div>
) : recentConversations.length > 0 ? (
  recentConversations.map((conversation) => (
    <SidebarMenuItem key={conversation.id} className="relative group">
      <div className="flex items-center justify-between w-full">
        <SidebarMenuButton
          asChild
          className="flex-col items-start h-auto py-3 flex-1"
        >
          <Link href={`/dashboard/conversation/${conversation.id}`}>
            <div className="flex items-center space-x-2 w-full">
              <MessageCircle className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium truncate">{conversation.youtube_title}</span>
            </div>
          </Link>
        </SidebarMenuButton>
        {/* Dropdown menu */}
        <div className="ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded bg-gray-100 hover:bg-gray-200 focus:outline-none">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="w-5 h-5 text-gray-500" fill="currentColor" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={async () => {
                // Remove from DB
                await supabase.from('conversations').delete().eq('id', conversation.id);
                // Remove from UI
                setRecentConversations((prev) => prev.filter((c) => c.id !== conversation.id));
              }}>
                <span className="text-red-600">Delete</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
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
        </>
      )}
    </Sidebar>
  )
}

