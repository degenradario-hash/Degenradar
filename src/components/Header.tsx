'use client'

import { useState } from 'react'

// Radar SVG icon - the brand mark
function RadarIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Outer ring */}
      <circle cx="20" cy="20" r="18" stroke="#00FF7F" strokeWidth="1.5" opacity="0.3" />
      <circle cx="20" cy="20" r="12" stroke="#00FF7F" strokeWidth="1" opacity="0.2" />
      <circle cx="20" cy="20" r="6" stroke="#00FF7F" strokeWidth="0.8" opacity="0.15" />
      {/* Center dot */}
      <circle cx="20" cy="20" r="2.5" fill="#00FF7F" />
      {/* Sweep line */}
      <line x1="20" y1="20" x2="20" y2="2" stroke="#00FF7F" strokeWidth="1.5" strokeLinecap="round" className="radar-sweep" style={{ transformOrigin: '20px 20px' }} />
      {/* Glow */}
      <circle cx="20" cy="20" r="2.5" fill="#00FF7F" opacity="0.4">
        <animate attributeName="r" values="2.5;5;2.5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export default function Header({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchValue, setSearchValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchValue)
  }

  return (
    <>
      {/* Top ticker bar */}
      <div className="bg-[#08080E] border-b border-[#1A1A28] overflow-hidden h-8 flex items-center">
        <div className="flex items-center gap-2 px-3 shrink-0 border-r border-[#1A1A28] h-full">
          <div className="live-dot" />
          <span className="text-[10px] font-semibold tracking-wider text-[#00FF7F] font-['Space_Mono']">LIVE</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="ticker-scroll flex items-center gap-6 whitespace-nowrap px-4">
            {['BTC $97,432 ↗', 'ETH $2,714 ↘', 'SOL $171.2 ↗', 'BNB $654 →', 'DOGE $0.182 ↗', 'PEPE $0.0000089 ↘', 'WIF $0.52 ↗', 'BONK $0.000012 ↗',
              'BTC $97,432 ↗', 'ETH $2,714 ↘', 'SOL $171.2 ↗', 'BNB $654 →', 'DOGE $0.182 ↗', 'PEPE $0.0000089 ↘', 'WIF $0.52 ↗', 'BONK $0.000012 ↗'
            ].map((item, i) => (
              <span key={i} className="text-[11px] font-['Space_Mono'] text-[#5A5A72]">
                {item.includes('↗') ? (
                  <><span className="text-[#C8C8D4]">{item.split(' ')[0]}</span> <span className="text-[#00FF7F]">{item.split(' ').slice(1).join(' ')}</span></>
                ) : item.includes('↘') ? (
                  <><span className="text-[#C8C8D4]">{item.split(' ')[0]}</span> <span className="text-[#FF3366]">{item.split(' ').slice(1).join(' ')}</span></>
                ) : (
                  <span className="text-[#C8C8D4]">{item}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="border-b border-[#1A1A28] bg-[#08080E]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-5 py-3 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <RadarIcon size={36} />
            <div>
              <h1 className="font-['Chakra_Petch'] font-bold text-xl leading-none tracking-tight">
                <span className="text-white">DEGEN</span>
                <span className="text-[#00FF7F] glow-text">RADAR</span>
              </h1>
              <p className="text-[9px] tracking-[0.3em] text-[#5A5A72] font-['Space_Mono'] mt-0.5">
                SCAN · DETECT · PROFIT
              </p>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-lg">
            <div className={`relative transition-all duration-200 ${isFocused ? 'scale-[1.02]' : ''}`}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search token, contract, or symbol..."
                className={`w-full bg-[#0C0C14] border rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-[#3A3A52] font-['Outfit'] focus:outline-none transition-all duration-200 ${
                  isFocused
                    ? 'border-[#00FF7F44] shadow-[0_0_20px_#00FF7F15,inset_0_0_20px_#00FF7F08]'
                    : 'border-[#1A1A28]'
                }`}
              />
              <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isFocused ? 'text-[#00FF7F]' : 'text-[#3A3A52]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchValue && (
                <button
                  type="button"
                  onClick={() => { setSearchValue(''); onSearch('') }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A72] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: 'Scanner', active: true },
              { label: 'Whales', active: false },
              { label: 'Yield', active: false },
            ].map(item => (
              <a
                key={item.label}
                href="#"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  item.active
                    ? 'text-[#00FF7F] bg-[#00FF7F0A]'
                    : 'text-[#5A5A72] hover:text-[#C8C8D4] hover:bg-[#ffffff06]'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="w-px h-5 bg-[#1A1A28] mx-2" />
            <a href="#" className="btn-primary text-xs">
              GO PRO
            </a>
          </nav>
        </div>
      </header>
    </>
  )
}
