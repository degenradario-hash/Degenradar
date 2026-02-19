import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DegenRadar | Memecoin Scanner & Crypto Intelligence',
  description: 'Real-time memecoin scanner with Safety Score, Bundle Detection, and Whale Tracking.',
  openGraph: {
    title: 'DegenRadar | Scan. Detect. Profit.',
    description: 'Real-time memecoin intelligence for degens.',
    url: 'https://degenradar.io',
    siteName: 'DegenRadar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DegenRadar',
    description: 'Scan. Detect. Profit.',
    creator: '@DegenRadarHQ',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050508] min-h-screen antialiased">{children}</body>
    </html>
  )
}
