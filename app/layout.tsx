import type { Metadata, Viewport } from 'next'
import './globals.css'
import { DEFAULT_SEO, OPEN_GRAPH, TWITTER_CARD, ROBOTS } from '@/lib/config/seo'

export const metadata: Metadata = {
  title: DEFAULT_SEO.title,
  description: DEFAULT_SEO.description,
  keywords: DEFAULT_SEO.keywords,
  authors: [{ name: DEFAULT_SEO.author }],
  manifest: '/manifest.json',
  openGraph: {
    type: OPEN_GRAPH.type,
    siteName: OPEN_GRAPH.siteName,
    title: OPEN_GRAPH.title,
    description: OPEN_GRAPH.description,
    locale: OPEN_GRAPH.locale,
    images: OPEN_GRAPH.images,
  },
  twitter: {
    card: TWITTER_CARD.card,
    title: TWITTER_CARD.title,
    description: TWITTER_CARD.description,
    images: TWITTER_CARD.images,
  },
  robots: ROBOTS,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#22c55e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
