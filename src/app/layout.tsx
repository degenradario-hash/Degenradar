import type { Metadata } from 'next'
import { Nova_Flat, Chakra_Petch, Space_Mono, Outfit } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const novaFlat = Nova_Flat({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-nova',
  display: 'swap',
})

const chakra = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-chakra',
  display: 'swap',
})

const space = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DegenRadar | Crypto Intelligence Platform',
  description: 'Real-time crypto markets, memecoin scanner, safety scoring, and on-chain intelligence.',
  keywords: ['crypto', 'memecoin', 'defi', 'scanner', 'safety score', 'degenradar'],
  openGraph: {
    title: 'DegenRadar',
    description: 'Real-time crypto markets, memecoin scanner, safety scoring.',
    siteName: 'DegenRadar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DegenRadar | Crypto Intelligence Platform',
    creator: '@DegenRadarHQ',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${novaFlat.variable} ${chakra.variable} ${space.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased font-body bg-[--bg-primary] text-[--text-primary]">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
