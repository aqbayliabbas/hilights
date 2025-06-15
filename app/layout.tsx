import type React from "react"
import type { Metadata } from "next"
import { Kanit, Phudu } from "next/font/google"
import "./globals.css"

const kanit = Kanit({ 
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-kanit',
  display: 'swap'
})

const phudu = Phudu({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-phudu',
  display: 'swap'
})

export const metadata: Metadata = {
  title: "Hilight - AI-Powered Learning Platform",
  description:
    "Transform any YouTube video into an interactive learning experience with AI-powered insights and community-driven education.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${kanit.variable} ${phudu.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
