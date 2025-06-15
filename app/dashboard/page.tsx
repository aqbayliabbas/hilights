"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Play, MessageCircle, Sparkles, Clock, Target, Award, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { VideoChat } from "@/components/video-chat"

export default function DashboardPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [showVideoChat, setShowVideoChat] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/
    return youtubeRegex.test(url)
  }

  const handleStartConversation = async () => {
    setError(null)
    setTranscript(null)
    if (!isValidYouTubeUrl(youtubeUrl)) {
      alert("Please enter a valid YouTube URL")
      return
    }
    setIsLoading(true)
    try {
      // Call new /api/transcribe endpoint
      const params = new URLSearchParams({
        url: youtubeUrl,
        text: 'true', // get plain text transcript
      });
      const res = await fetch(`/api/transcribe?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }
      setTranscript(data.content);
      // Save video URL and transcription to Supabase
      try {
        // Get the current user's access token
        const session = await import('@/utils/supabaseClient').then(m => m.supabase.auth.getSession());
        const access_token = (await session).data.session?.access_token;

        // Helper to fetch YouTube video title using oEmbed
        async function fetchYouTubeTitle(url: string): Promise<string | null> {
          try {
            const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const res = await fetch(oEmbedUrl);
            if (!res.ok) return null;
            const json = await res.json();
            return json.title || null;
          } catch (e) {
            return null;
          }
        }
        const youtube_title = (await fetchYouTubeTitle(youtubeUrl)) || 'Untitled Video';
        const chat = null; // Replace with actual chat data if available
        await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ youtube_title, youtube_url: youtubeUrl, transcription: data.content, chat, access_token })
        });
      } catch (saveErr) {
        // Optional: Show a warning if saving fails, but don't block the UI
        console.warn('Failed to save video and transcription:', saveErr);
      }
      setShowVideoChat(true);
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  }

  const handleBackToDashboard = () => {
    setShowVideoChat(false)
    setYoutubeUrl("")
    setTranscript(null)
    setError(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 min-h-screen p-6 overflow-y-auto relative">
        {/* Square Grid Background */}
        <div className="fixed inset-0 z-[0] pointer-events-none">
          <div 
            className="absolute inset-0 bg-[#fdf8f5]"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.1) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0.5px, transparent 0.5px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '-1px -1px',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 80%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse at center, black 80%, transparent 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fdf8f5]" />
        </div>
        {showVideoChat ? (
          <VideoChat videoUrl={youtubeUrl} transcript={transcript} onBack={handleBackToDashboard} />
        ) : (
          <div className="max-w-4xl mx-auto relative z-10">
            {error && (
              <div className="mb-4 text-red-600 text-center font-medium">{error}</div>
            )}
            {/* Main Action Card */}
            <Card className="max-w-2xl mx-auto bg-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Start Learning</h2>
                  </div>
                  <p className="text-gray-600">Paste a YouTube URL below to begin your AI-powered learning session</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Input
                      id="youtube-url"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="h-12 text-base bg-white border-0 focus:bg-blue-50 transition-colors duration-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <p className="text-sm text-gray-500">Works with educational videos, tutorials, lectures, and more</p>
                  </div>

                  <Button
                    onClick={handleStartConversation}
                    disabled={isLoading}
                    className="w-full h-14 text-lg"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Video...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Start AI Conversation
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
