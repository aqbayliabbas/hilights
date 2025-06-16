'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Brain, TrendingUp, Users, Star, MessageCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { YouTubeSlider } from "@/components/youtube-slider"
import { SolutionSection } from "@/components/solution-section"
import { HowItWorks } from "@/components/how-it-works"
import { FAQ } from "@/components/faq"
import { useRouter } from 'next/navigation';
import { smoothScroll } from '@/utils/smooth-scroll';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLearnNow = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Redirect after 1 second
    setTimeout(() => {
      router.push('/signup');
    }, 1000);
  };

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
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image src="/logo wordmark.png" alt="Hilight Logo" width={120} height={40}/>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <a 
                href="#features" 
                onClick={(e) => smoothScroll(e, 'features')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                Features
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <a 
                href="#how-it-works" 
                onClick={(e) => smoothScroll(e, 'how-it-works')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                How it Works
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <a 
                href="#solution" 
                onClick={(e) => smoothScroll(e, 'solution')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                Our Solution
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <a 
                href="#faq" 
                onClick={(e) => smoothScroll(e, 'faq')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                FAQ
              </a>
            </Button>
          </nav>
          <div className="flex items-center space-x-2">
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white">
              <Link href="/signup">Start Learning</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="py-16 md:py-24 bg-transparent">
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
          <p className="text-xl text-gray-600 mb-8 max-w-3x2 mx-auto leading-relaxed">
            Turn any YouTube video into an interactive learning experience with AI-powered solution.
          </p>
          <div className="max-w-2xl mx-auto p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm mb-0 relative overflow-hidden group">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient bg-[length:200%_200%] group-hover:animate-gradient-hover" />
            <div className="relative z-10">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <label htmlFor="youtube-url" className="sr-only">YouTube Video URL</label>
                <input
                  type="url"
                  id="youtube-url"
                  placeholder="Paste a YouTube video link"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400 text-gray-700 font-medium"
                />
              </div>
              <Button 
                onClick={handleLearnNow}
                disabled={isLoading}
                className={`bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Learn Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            </div>
          </div>

          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 py-6">
                Start Learning
              </Button>
            </Link>
          </div> */}
          <div className="mt-16">
            <Image
              src="/image.png"
              alt="Hilight Dashboard Preview"
              width={800}
              height={400}
              className="mx-auto rounded-2xl shadow-2xl border"
            />
          </div>
        </div>
      </section>
      <section id="features" className="pt-8 md:pt-12">
        <YouTubeSlider />
      </section>
      
      <section id="solution" className="pt-8 md:pt-12">
        <SolutionSection />
      </section>
      
      <section id="how-it-works" className="pt-8 pb-12 md:pt-12 md:pb-16">
        <HowItWorks />
      </section>
      
      <section id="faq" className="pt-8 pb-12 md:pt-12 md:pb-16">
        <FAQ />
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
