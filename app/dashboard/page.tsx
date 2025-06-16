"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Play, MessageCircle, Sparkles, Clock, Target, Award, Loader2, Info } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { VideoChat } from "@/components/video-chat"

export default function DashboardPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [showVideoChat, setShowVideoChat] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<NodeJS.Timeout>()
  const [transcript, setTranscript] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/
    return youtubeRegex.test(url)
  }

  // Check if URL has been used before
  const isUrlUsed = (url: string): boolean => {
    if (typeof window === 'undefined') return false;
    const usedUrls = JSON.parse(localStorage.getItem('usedYouTubeUrls') || '[]');
    return usedUrls.includes(url);
  };

  // Add URL to used list in localStorage
  const markUrlAsUsed = (url: string) => {
    if (typeof window === 'undefined') return;
    const usedUrls = new Set(JSON.parse(localStorage.getItem('usedYouTubeUrls') || '[]'));
    usedUrls.add(url);
    localStorage.setItem('usedYouTubeUrls', JSON.stringify(Array.from(usedUrls)));
  };

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleStartConversation = async () => {
    setError(null);
    setTranscript(null);
    setShowVideoChat(false);
    
    // Validate URL format
    if (!isValidYouTubeUrl(youtubeUrl)) {
      showNotification("Please enter a valid YouTube URL");
      return;
    }

    const isDuplicate = isUrlUsed(youtubeUrl);
    
    if (isDuplicate) {
      showNotification("Loading previous analysis...");
    } else {
      markUrlAsUsed(youtubeUrl);
      showNotification("Analyzing video content...");
    }
    
    // Reset and start progress
    setProgress(0);
    setIsLoading(true);
    
    // Simulate progress (0-90%)
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval.current);
          return 90;
        }
        return prev + 1;
      });
    }, 100);
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
      
      const transcriptContent = data.content;
      setTranscript(transcriptContent);
      
      // Complete the progress to 100% when done
      setProgress(100);
      // Don't reset progress immediately - keep it at 100% as the chat loads
      setTimeout(() => setProgress(0), 1500);
      
      // Show the video chat immediately with the transcript
      setShowVideoChat(true);
      
      // Save video URL and transcription to Supabase in the background
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
    setProgress(0)
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
    // Scroll to top when going back to the form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Toast notification component
  const ToastNotification = () => (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition-opacity duration-300 ${
      showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'
    } bg-blue-100 border border-blue-400 text-blue-700`}>
      <div className="flex items-center">
        <span className="mr-2">ℹ️</span>
        <p>{toastMessage}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <ToastNotification />
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
        {showVideoChat && transcript ? (
          <div className="w-full max-w-6xl mx-auto relative z-10">
            <VideoChat videoUrl={youtubeUrl} transcript={transcript} onBack={handleBackToDashboard} />
          </div>
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

                  <div className="w-full relative">
                    {isLoading && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                    <Button
                      onClick={handleStartConversation}
                      disabled={isLoading}
                      className="w-full h-14 text-lg relative overflow-hidden"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing Video... {progress}%
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Start AI Conversation
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
