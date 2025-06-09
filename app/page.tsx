import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Brain, TrendingUp, Users, Star, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Hilight</span>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
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
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-gray-100 text-gray-700 hover:bg-gray-100">
            🚀 Transform Your Learning Experience
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            Learn Smarter with
            <br />
            AI-Powered Insights
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Turn any YouTube video into an interactive learning experience. Copy, paste, and unlock the power of
            AI-driven education that adapts to your learning style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 py-6">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          <div className="mt-16">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Hilight Dashboard Preview"
              width={800}
              height={400}
              className="mx-auto rounded-2xl shadow-2xl border"
            />
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Hilight Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform any YouTube video into a personalized learning experience in just three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-2 hover:border-blue-200 transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Copy YouTube Link"
                  width={300}
                  height={200}
                  className="mx-auto mb-6 rounded-lg"
                />
                <h3 className="text-xl font-semibold mb-4">Copy YouTube Link</h3>
                <p className="text-gray-600">
                  Find any educational YouTube video and copy its URL. Works with tutorials, lectures, and educational
                  content.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-2 hover:border-purple-200 transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Paste into Hilight"
                  width={300}
                  height={200}
                  className="mx-auto mb-6 rounded-lg"
                />
                <h3 className="text-xl font-semibold mb-4">Paste into Hilight</h3>
                <p className="text-gray-600">
                  Paste the URL into Hilight and watch as our AI analyzes the content and prepares your learning
                  materials.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-2 hover:border-pink-200 transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Learn with AI"
                  width={300}
                  height={200}
                  className="mx-auto mb-6 rounded-lg"
                />
                <h3 className="text-xl font-semibold mb-4">Learn with AI</h3>
                <p className="text-gray-600">
                  Engage with interactive quizzes, summaries, and personalized insights powered by advanced AI
                  technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the tools that make Hilight the ultimate learning companion
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-gray-700 mb-6" />
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of learners who have transformed their education with Hilight
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Invite */}
      <section id="community" className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <MessageCircle className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">Join Our Learning Community</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Connect with fellow learners, share insights, get help, and stay updated with the latest features. Our
              community is here to support your learning journey.
            </p>
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6">
              Join WhatsApp Community
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-bold">Hilight</span>
              </div>
              <p className="text-gray-400">
                Transform your learning experience with AI-powered insights and community-driven education.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Hilight. All rights reserved.</p>
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
