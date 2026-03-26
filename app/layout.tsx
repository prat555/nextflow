import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Krea: AI Creative Suite for Images, Video & 3D',
  description: 'Generate, enhance, and edit images, videos, or 3D meshes for free with AI. The most powerful AI suite for creatives.',
  icons: {
    icon: '/profile.png',
    shortcut: '/profile.png',
    apple: '/profile.png',
  },
}

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API
const clerkOrigin = clerkFrontendApi
  ? `https://${clerkFrontendApi.replace(/^https?:\/\//, "")}`
  : null

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://accounts.google.com" />
        <link rel="dns-prefetch" href="//accounts.google.com" />
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//www.gstatic.com" />
        {clerkOrigin ? <link rel="preconnect" href={clerkOrigin} /> : null}
        {clerkOrigin ? <link rel="dns-prefetch" href={`//${clerkOrigin.replace(/^https?:\/\//, "")}`} /> : null}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  )
}
