import Link from 'next/link'
import Image from 'next/image'

const PRODUCT_LINKS = [
  { href: '/markets', label: 'Markets' },
  { href: '/dexscan', label: 'DexScan' },
  { href: '/news', label: 'News' },
  { href: '/blog', label: 'Blog' },
]

const RESOURCE_LINKS = [
  { href: '#', label: 'API Docs', soon: true },
  { href: '#', label: 'FAQ', soon: true },
  { href: '#', label: 'Safety Scoring', soon: true },
]

const SOCIAL_LINKS = [
  { href: 'https://twitter.com/DegenRadarHQ', label: '𝕏 Twitter' },
  { href: '#', label: 'YouTube' },
  { href: '#', label: 'TikTok' },
  { href: '#', label: 'Telegram' },
  { href: '#', label: 'Discord' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[--border] mt-16">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-3">
              <Image
                src="/logo_z_tekstem.png"
                alt="DegenRadar"
                width={128}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-[--text-muted] mb-4">
              Crypto intelligence platform for degens who do their own research.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-[--text-secondary]">
              {SOCIAL_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[--accent] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[--text-secondary] hover:text-[--accent] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map(link => (
                <li key={link.label} className="flex items-center gap-2">
                  <span className="text-sm text-[--text-muted]">{link.label}</span>
                  {link.soon && (
                    <span className="pill bg-[--accent-muted] text-[--accent] text-[9px]">Soon</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-[--text-secondary] hover:text-[--accent] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-[--text-secondary] hover:text-[--accent] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-[--text-secondary] hover:text-[--accent] transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[--border] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[--text-muted]">
          <span>Data: CoinGecko + DexScreener</span>
          <span>&copy; 2026 DegenRadar.io — All rights reserved</span>
        </div>
      </div>
    </footer>
  )
}
