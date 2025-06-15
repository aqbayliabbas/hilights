import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Brain, TrendingUp, Users, Star, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { YouTubeSlider } from "@/components/youtube-slider"

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Advanced AI analyzes your learning patterns and adapts content to maximize retention and understanding.",
    },
    {
      icon: TrendingUp,
      title: "Adaptive Progress Tracking",
      description: "Smart tracking system that adjusts to your pace and identifies areas that need more focus.",
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with learners worldwide, share insights, and learn together in our vibrant community.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "Hilight transformed how I learn from YouTube tutorials. The AI insights are incredible!",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Software Developer",
      content: "Finally, a way to turn YouTube videos into structured learning experiences. Game changer!",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Data Analyst",
      content: "The progress tracking keeps me motivated and the community features are amazing.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#fdf8f5] [background-image:linear-gradient(to_right,#d1d5db_0.5px,transparent_0.5px),linear-gradient(to_bottom,#d1d5db_0.5px,transparent_0.5px)] bg-[size:12px_12px]">
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#fdf8f5] via-[#fdf8f5cc] to-transparent"></div>
        </div>
      </div>
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image src="/logo wordmark.png" alt="Hilight Logo" width={120} height={120}/>
            </Link>
          </div>
          {/* <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link href="#features">Features</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#how-it-works">How it Works</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#testimonials">Testimonials</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#community">Community</Link>
            </Button>
          </nav> */}
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/signup">Start Learning</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-opacity-0">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 px-3 py-1 text-sm bg-green-50 text-green-700 hover:bg-green-100 border border-green-100 rounded-md shadow-sm hover:shadow transition-shadow">
            LEARN FROM YOUTUBE EFFECTIVELY
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 uppercase tracking-tight">
            NO MORE WASTED HOURS
            <br />
            <span className="relative">
              <span className="gradient-underline">LEARN A SKILL IN DAYS</span>
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Turn any YouTube video into an interactive learning experience. Copy, paste, and unlock the power of
            AI-driven education that adapts to your learning style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 py-6">
                Start Learning
              </Button>
            </Link>
          </div>
          <div className="mt-16">
            <Image
              src="/image.png"
              alt="Hilight Dashboard Preview"
              width={800}
              height={400}
              className="mx-auto rounded-2xl shadow-2xl border"
            />
          </div>
          
          {/* YouTube Tutorials Slider */}
          <div className="mt-32 w-full">
            <YouTubeSlider />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 px-4">
        <div className="container mx-auto">
          <div className="border-t border-gray-800 pb-3 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400"> {new Date().getFullYear()} Hilight. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
