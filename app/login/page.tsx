"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/utils/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (supabaseError) {
        setError(supabaseError.message)
      } else if (data && data.user) {
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        setError("Invalid email or password.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fdf8f5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border bg-[#fdf8f5]">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
  <Link href="/">
    <img
      src="/logo%20wordmark.png"
      alt="Hilight Logo"
      className="h-12 object-contain cursor-pointer"
    />
  </Link>
</div>
          
          <CardDescription className="text-gray-600">Sign in to your account to continue learning</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-900 text-white font-semibold hover:bg-blue-800 transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-blue-800 hover:underline font-medium">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-800 hover:text-blue-700 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
