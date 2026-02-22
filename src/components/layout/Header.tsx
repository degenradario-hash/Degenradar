'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import ThemeToggle from './ThemeToggle'
import HamburgerMenu from './HamburgerMenu'

const NAV_LINKS = [
  { href: '/markets', label: 'Markets' },
  { href: '/exchanges', label: 'Exchanges' },
  { href: '/dexscan', label: 'DexScan' },
  { href: '/news', label: 'News' },
  { href: '/blog', label: 'Blog' },
]

export default function Header() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/markets?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[--bg-primary]/90 border-b border-[--border]">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center">
        {/* Logo — left */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo_z_tekstem.png"
            alt="DegenRadar"
            width={280}
            height={56}
            className="h-[56px] w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav — centered absolutely */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-lg text-[16px] font-medium transition-colors ${
                  isActive
                    ? 'dark:text-[--accent] bg-[--accent] text-[#1A191A] dark:bg-transparent'
                    : 'text-[--text-primary] dark:text-[#E0DFDA] hover:text-[--accent] hover:bg-[--bg-tertiary]'
                }`}
              >
                {link.label}
                {isActive && (
                  <div className="h-0.5 bg-[--accent] mt-0.5 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right side: Search + Theme + Hamburger — pushed right */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search coins..."
                className="w-48 lg:w-56 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-[--border] bg-[--bg-secondary] text-[--text-primary] placeholder-[--text-muted] focus:outline-none focus:border-[--accent] transition-colors"
              />
            </div>
          </form>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[--border] hover:border-[--accent]"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>

          <ThemeToggle />
          <HamburgerMenu />
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search coins..."
                autoFocus
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[--border] bg-[--bg-secondary] text-[--text-primary] placeholder-[--text-muted] focus:outline-none focus:border-[--accent]"
              />
            </div>
          </form>
        </div>
      )}
    </header>
  )
}
