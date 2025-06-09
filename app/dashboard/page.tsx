"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Play, MessageCircle, Sparkles, Clock, Target, Award } from "lucide-react"
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
      {showVideoChat ? (
        <VideoChat videoUrl={youtubeUrl} transcript={transcript} onBack={handleBackToDashboard} />
      ) : (
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-4 text-red-600 text-center font-medium">{error}</div>
          )}
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">H</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Hilight</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform any YouTube video into an interactive learning experience with AI-powered insights and
              personalized conversations.
            </p>
          </div>

          {/* Main Action Card */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Sparkles className="h-6 w-6 text-gray-700" />
                  <h2 className="text-2xl font-semibold text-gray-900">Start Learning</h2>
                </div>
                <p className="text-gray-600">Paste a YouTube URL below to begin your AI-powered learning session</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="youtube-url" className="text-base font-medium">
                    YouTube Video URL
                  </Label>
                  <Input
                    id="youtube-url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="h-12 text-base"
                  />
                  <p className="text-sm text-gray-500">Works with educational videos, tutorials, lectures, and more</p>
                </div>

                <Button
                  onClick={handleStartConversation}
                  disabled={!youtubeUrl.trim() || isLoading}
                  className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

              {/* Feature Highlights */}
              <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8">
                <Separator className="col-span-3" />
                <Card className="text-center border-0 shadow-none">
                  <CardContent className="pt-6">
                    <Play className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <CardTitle className="text-base mb-2">Video Analysis</CardTitle>
                    <CardDescription>AI extracts key concepts and insights</CardDescription>
                  </CardContent>
                </Card>
                <Card className="text-center border-0 shadow-none">
                  <CardContent className="pt-6">
                    <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <CardTitle className="text-base mb-2">Interactive Chat</CardTitle>
                    <CardDescription>Ask questions and get personalized explanations</CardDescription>
                  </CardContent>
                </Card>
                <Card className="text-center border-0 shadow-none">
                  <CardContent className="pt-6">
                    <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <CardTitle className="text-base mb-2">Smart Insights</CardTitle>
                    <CardDescription>Adaptive learning recommendations</CardDescription>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Videos Analyzed</CardTitle>
                <Play className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5h</div>
                <p className="text-xs text-muted-foreground">+3.2h from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">+5% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Day Streak</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
