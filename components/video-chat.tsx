"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Loader2, 
  ChevronUp, 
  ChevronDown,
  Bot,
  User,
  MessageCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoChatProps {
  videoUrl: string
  onBack: () => void
  transcript?: string | null
  chat?: Message[]
}

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function VideoChat({ videoUrl, onBack, transcript, chat }: VideoChatProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const videoId = getYouTubeId(videoUrl);
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  
  // State for thumbnail URL
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  
  const [embeddingAllowed, setEmbeddingAllowed] = useState(true);

  // Set thumbnail URL when video ID is available
  useEffect(() => {
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
      // Check if embedding is allowed
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
        .then(response => response.json())
        .then(() => setEmbeddingAllowed(true))
        .catch(() => setEmbeddingAllowed(false));
    }
  }, [videoId]);
  
  // Load YouTube IFrame API
  useEffect(() => {
    if (isYouTube && !window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    } else if (isYouTube) {
      setIsApiReady(true);
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [isYouTube]);

  // Initialize YouTube player when API is ready
  useEffect(() => {
    if (isApiReady && videoId && playerRef.current && !player) {
      try {
        const ytPlayer = new window.YT.Player(playerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            fs: 1,
            playsinline: 1
          },
          events: {
            onReady: (event: any) => {
              setPlayer(event.target);
            },
            onError: (event: any) => {
              console.error('YouTube Player Error:', event.data);
            }
          }
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
      }
    }
  }, [isApiReady, videoId, player]);

  // Real chat state only
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (chat && Array.isArray(chat) && chat.length > 0) {
      // Convert timestamp to Date if needed
      return chat.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      }));
    }
    return [];
  });
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transcription, setTranscription] = useState<string>(transcript || "")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isTranscriptionExpanded, setIsTranscriptionExpanded] = useState(false);
  const [transcribeError, setTranscribeError] = useState<string | null>(null)

  // Video metadata for PDF
  const videoMetadata = {
    title: "",
    channel: "",
    duration: "",
    publishDate: "",
    description: "",
    tags: ["React", "JavaScript", "Frontend", "Hooks", "Tutorial"],
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

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

  // const handleDownloadPDF = async () => {
  //   try {
  //     await generateTranscriptPDF({
  //       transcription,
  //       videoMetadata,
  //       videoUrl,
  //     })
  //   } catch (error) {
  //     console.error("Failed to generate PDF:", error)
  //     // Fallback to text download
  //     const blob = new Blob([transcription], { type: "text/plain" })
  //     const url = URL.createObjectURL(blob)
  //     const a = document.createElement("a")
  //     a.href = url
  //     a.download = "video-transcription.txt"
  //     a.click()
  //     URL.revokeObjectURL(url)
  //   }
  // }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ask-about-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.content,
          videoId: videoId,
          videoUrl: videoUrl,
        }),
      });
      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.answer || data.error || "Sorry, I couldn't find an answer.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
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
              {isYouTube && videoId ? (
                embeddingAllowed ? (
                  <div className="relative pt-[56.25%] h-0 overflow-hidden rounded-t-lg bg-black">
                    <div ref={playerRef} className="absolute top-0 left-0 w-full h-full" />
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={thumbnailUrl}
                      alt="Video thumbnail"
                      className="w-full h-auto max-h-[500px] object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-t-lg">
                      <a 
                        href={videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-black/60 hover:bg-black/70 text-white rounded-lg p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 opacity-90 hover:opacity-100"
                        title="Watch on YouTube"
                      >
                        <Play className="h-5 w-5 fill-current" />
                      </a>
                    </div>
                  </div>
                )
              ) : (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-auto max-h-[500px] object-contain rounded-t-lg bg-black"
                  poster={thumbnailUrl}
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              )}
              {/* <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-white/90 text-gray-900 hover:bg-white"
                  onClick={() => window.open(videoUrl, "_blank")}
                >
                  <Play className="h-6 w-6 mr-2" />
                  Watch Video
                </Button>
              </div> */}
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
              <div className="flex items-center space-x-2">
                {transcription && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => setIsTranscriptionExpanded(!isTranscriptionExpanded)}
                      aria-label={isTranscriptionExpanded ? 'Collapse transcription' : 'Expand transcription'}
                    >
                      {isTranscriptionExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    {/* <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button> */}
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          {isTranscriptionExpanded && <CardContent>
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
          </CardContent>}
        </Card>
      </div>

      {/* Chat Section */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>AI Learning Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col-reverse min-h-full" style={{ minHeight: '400px' }}>
              <div ref={messagesEndRef} />
              {[...messages]
                .reverse()
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
                      <div className="flex items-center space-x-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4 mt-auto">
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
