"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Play, MessageCircle, Send, Bot, User, Loader2, FileText, Download, ArrowLeft } from "lucide-react"
import { generateTranscriptPDF } from "@/lib/pdf-generator"

interface VideoChatProps {
  videoUrl: string
  onBack: () => void
  transcript?: string | null
}

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export function VideoChat({ videoUrl, onBack, transcript }: VideoChatProps) {
  // Move getVideoId function to the top
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  // Now these can use getVideoId safely
  const videoId = getVideoId(videoUrl)
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "/placeholder.svg?height=200&width=400"

  // Simulated mock chat data if no real chat yet
  const mockChat: Message[] = [
    {
      id: "1",
      type: "ai",
      content: "Welcome! I'm your AI learning assistant. How can I help you with React Hooks today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "2",
      type: "user",
      content: "What is useState?",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
      id: "3",
      type: "ai",
      content: "useState is a React hook that lets you add state to functional components. Would you like an example?",
      timestamp: new Date(Date.now() - 1000 * 60 * 2 + 5000),
    },
    {
      id: "4",
      type: "user",
      content: "Yes, please show me an example.",
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
    },
    {
      id: "5",
      type: "ai",
      content: "Sure! Here is a simple example: \n\nconst [count, setCount] = useState(0);\n\nThis creates a state variable called count, initialized to 0.",
      timestamp: new Date(Date.now() - 1000 * 60 * 1 + 5000),
    },
  ];

  // If no real chat history, show mock chat
  const [messages, setMessages] = useState<Message[]>(mockChat)
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transcription, setTranscription] = useState<string>(transcript || "")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcribeError, setTranscribeError] = useState<string | null>(null)

  // Video metadata for PDF
  const videoMetadata = {
    title: "Introduction to React Hooks",
    channel: "React Learning Hub",
    duration: "24:35",
    publishDate: "2024-01-15",
    description: "Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks.",
    tags: ["React", "JavaScript", "Frontend", "Hooks", "Tutorial"],
  }

  // Fetch transcription from API if not provided
  useEffect(() => {
    const fetchTranscription = async () => {
      if (!videoId || transcript) return;
      setIsTranscribing(true)
      setTranscribeError(null)
      try {
        const params = new URLSearchParams({
          url: videoUrl,
          text: 'true', // get plain text transcript
        });
        const res = await fetch(`/api/transcribe?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch transcript');
        }
        setTranscription(data.content || "");
      } catch (err: any) {
        setTranscribeError(err.message || 'Unexpected error');
      } finally {
        setIsTranscribing(false);
      }
    };
    if (videoId && !transcription && !isTranscribing) {
      fetchTranscription();
    }
  }, [videoId, videoUrl, transcript]);

  const handleDownloadPDF = async () => {
    try {
      await generateTranscriptPDF({
        transcription,
        videoMetadata,
        videoUrl,
      })
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      // Fallback to text download
      const blob = new Blob([transcription], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "video-transcription.txt"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `That's a great question about "${inputMessage}". Based on the video content, I can explain that this concept relates to how React manages state and side effects. Would you like me to break this down further or provide some practice examples?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-full">
      {/* Video Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary">AI Analysis Complete</Badge>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={thumbnailUrl || "/placeholder.svg"}
                alt="Video thumbnail"
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-white/90 text-gray-900 hover:bg-white"
                  onClick={() => window.open(videoUrl, "_blank")}
                >
                  <Play className="h-6 w-6 mr-2" />
                  Watch Video
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Transcription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Video Transcription</span>
              </div>
              {transcription && (
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isTranscribing ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Generating transcription...</p>
                  <p className="text-xs text-gray-500 mt-1">This may take a moment</p>
                </div>
              </div>
            ) : transcription ? (
              <div className="space-y-4">
                <Textarea
                  value={transcription}
                  readOnly
                  className="min-h-[200px] text-sm leading-relaxed"
                  placeholder="Transcription will appear here..."
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{transcription.split(" ").length} words</span>
                  <span>AI-generated transcription</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Loading transcription...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat Section */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>AI Learning Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" style={{ maxHeight: 400, overflowY: 'auto' }}>
            <div className="space-y-4">
              {messages
                // filter out any message that is just the transcript (shouldn't exist, but extra safe)
                .filter((msg) => msg.content !== transcription)
                .map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.type === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask about the video content..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
