import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const kanit = localFont({
  src: [
    {
      path: '../public/fonts/Kanit-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/Kanit-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/Kanit-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Kanit-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Kanit-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Kanit-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Kanit-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Kanit-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/Kanit-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-kanit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Hilight - AI-Powered Learning Platform",
  description:
    "Transform any YouTube video into an interactive learning experience with AI-powered insights and community-driven education.",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={kanit.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
