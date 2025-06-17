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

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {isYouTube && videoId ? (
                embeddingAllowed ? (
                  <div className="relative pt-[56.25%] h-0 overflow-hidden bg-black">
                    <div ref={playerRef} className="absolute top-0 left-0 w-full h-full" />
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={thumbnailUrl}
                      alt="Video thumbnail"
                      className="w-full h-auto max-h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <a 
                        href={videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-black/60 hover:bg-black/70 text-white rounded-full p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 opacity-90 hover:opacity-100"
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
                  className="w-full h-auto max-h-[500px] object-contain bg-black"
                  poster={thumbnailUrl}
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Video Transcription */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-violet-700" />
                <span>Video Transcription</span>
              </div>
              {transcription && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsTranscriptionExpanded(!isTranscriptionExpanded)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isTranscriptionExpanded ? (
                    <ChevronUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  )}
                  {isTranscriptionExpanded ? 'Hide' : 'Show'}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          {isTranscriptionExpanded && (
            <CardContent className="pt-0">
              {isTranscribing ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p className="text-sm text-muted-foreground">Generating transcription...</p>
                  <p className="text-xs text-muted-foreground">This may take a moment</p>
                </div>
              ) : transcription ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      value={transcription}
                      readOnly
                      className="min-h-[200px] text-sm leading-relaxed bg-muted/50 border-0 focus-visible:ring-0 resize-none"
                      placeholder="Transcription will appear here..."
                    />
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-md">
                      <span className="text-xs text-muted-foreground">{transcription.split(" ").length} words</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Bot className="h-3 w-3" />
                      <span>Let's Chat</span>
                    </div>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <FileText className="h-12 w-12 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No transcription available</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      {/* Chat Section */}
      <Card className="flex flex-col h-[600px] overflow-hidden">
        <CardHeader className="py-3 px-4 border-b bg-muted/30">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9 bg-gray-900">
              <AvatarFallback className="bg-gray-900 text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-foreground">AI Learning Assistant</h3>
          </div>
        </CardHeader>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <div className="bg-muted/50 rounded-full p-3 mb-3">
                    <MessageCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Let's Chat</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Get instant answers to your questions about this video content.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div 
                      key={message.id}
                      className={cn(
                        "flex transition-all duration-200",
                        message.type === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className="flex items-start max-w-[85%] group">
                        {message.type === "ai" && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarFallback className="bg-blue-500 text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2.5 text-sm",
                              message.type === "user"
                                ? "bg-violet-700 text-white rounded-br-sm"
                                : "bg-muted rounded-bl-sm"
                            )}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div className="flex items-center mt-1 px-1">
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarFallback className="bg-violet-700 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex items-center space-x-1.5">
                        <div className="h-2 w-2 rounded-full bg-violet-700 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2 w-2 rounded-full bg-violet-700 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-2 w-2 rounded-full bg-violet-700 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t bg-background/80 backdrop-blur-sm p-3">
            <div className="relative flex items-end rounded-lg border bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
              {/* Attachment button removed as requested */}
              <div className="flex-1 mx-2">
                <div className="relative">
                  <div 
                    contentEditable
                    className="max-h-32 min-h-[40px] w-full resize-none bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    placeholder="Message AI Assistant..."
                    onInput={(e) => setInputMessage(e.currentTarget.textContent || '')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (inputMessage.trim()) {
                          handleSendMessage();
                          e.currentTarget.textContent = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  if (inputMessage.trim()) {
                    handleSendMessage();
                    const input = document.querySelector('[contenteditable]') as HTMLElement;
                    if (input) input.textContent = '';
                  }
                }}
                disabled={!inputMessage.trim() || isLoading}
                className={cn(
                  "inline-flex items-center justify-center rounded-full p-1.5 transition-colors",
                  inputMessage.trim() 
                    ? "bg-violet-700 text-white hover:bg-violet-800" 
                    : "text-muted-foreground"
                )}
                aria-label="Send message"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
