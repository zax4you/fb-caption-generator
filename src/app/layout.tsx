import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Caption Generator - Create Social Media Posts',
  description: 'Generate beautiful social media captions with custom backgrounds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600`}>
        {children}
      </body>
    </html>
  )
}