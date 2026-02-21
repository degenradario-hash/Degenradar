'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon, GlobeAltIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { href: '/markets', label: 'Markets' },
  { href: '/exchanges', label: 'Exchanges' },
  { href: '/dexscan', label: 'DexScan' },
  { href: '/news', label: 'News' },
  { href: '/blog', label: 'Blog' },
]

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const [langModal, setLangModal] = useState(false)
  const [currModal, setCurrModal] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[--border] hover:border-[--accent]"
        aria-label="Open menu"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[100]"
              onClick={() => setOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 w-[300px] bg-[--bg-primary] border-l border-[--border] z-[101] p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-heading font-bold text-lg">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Auth buttons */}
              <div className="flex gap-3 mb-6">
                <button className="btn flex-1 text-center">Log In</button>
                <button className="btn-accent btn flex-1 text-center border-0">Sign Up</button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 mb-6">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="py-3 px-3 rounded-lg hover:bg-[--bg-tertiary] font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="py-3 px-3 rounded-lg text-[--text-muted] flex items-center justify-between">
                  Dashboard
                  <span className="pill bg-[--accent-muted] text-[--accent] text-[10px]">Soon</span>
                </div>
              </nav>

              <div className="border-t border-[--border] pt-4 flex flex-col gap-2">
                {/* Language */}
                <button
                  onClick={() => setLangModal(!langModal)}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[--bg-tertiary] text-sm"
                >
                  <GlobeAltIcon className="w-4 h-4" />
                  Language: English
                </button>
                {/* Currency */}
                <button
                  onClick={() => setCurrModal(!currModal)}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[--bg-tertiary] text-sm"
                >
                  <CurrencyDollarIcon className="w-4 h-4" />
                  Currency: USD
                </button>
              </div>

              {/* Theme toggle */}
              <div className="border-t border-[--border] mt-4 pt-4">
                <p className="text-xs text-[--text-muted] mb-2">Theme</p>
                <div className="flex gap-2">
                  {(['dark', 'light', 'system'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors capitalize ${
                        theme === t
                          ? 'border-[--accent] bg-[--accent-muted] text-[--accent]'
                          : 'border-[--border] text-[--text-secondary]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Language Modal */}
      <AnimatePresence>
        {langModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[200]"
              onClick={() => setLangModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] bg-[--bg-secondary] border border-[--border] rounded-xl p-6 z-[201]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading font-bold text-lg">Select Language</h3>
                <button onClick={() => setLangModal(false)}><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                {['English', 'Spanish', 'Portuguese', 'French', 'German', 'Italian', 'Dutch', 'Polish', 'Russian', 'Ukrainian', 'Turkish', 'Arabic', 'Hindi', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Vietnamese', 'Thai', 'Indonesian', 'Malay', 'Filipino', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Czech', 'Romanian', 'Hungarian', 'Greek'].map(lang => (
                  <button
                    key={lang}
                    className={`text-left px-3 py-2 rounded-lg text-sm hover:bg-[--bg-tertiary] transition-colors ${lang === 'English' ? 'text-[--accent] font-semibold' : 'text-[--text-secondary]'}`}
                    onClick={() => setLangModal(false)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Currency Modal */}
      <AnimatePresence>
        {currModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[200]"
              onClick={() => setCurrModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] bg-[--bg-secondary] border border-[--border] rounded-xl p-6 z-[201]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading font-bold text-lg">Select Currency</h3>
                <button onClick={() => setCurrModal(false)}><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                {['🇺🇸 USD', '🇪🇺 EUR', '🇬🇧 GBP', '🇯🇵 JPY', '🇰🇷 KRW', '🇨🇳 CNY', '🇦🇺 AUD', '🇨🇦 CAD', '🇨🇭 CHF', '🇮🇳 INR', '🇧🇷 BRL', '🇷🇺 RUB', '🇹🇷 TRY', '🇸🇬 SGD', '🇭🇰 HKD', '🇹🇼 TWD', '🇵🇱 PLN', '🇸🇪 SEK', '🇳🇴 NOK', '🇩🇰 DKK', '🇿🇦 ZAR', '🇲🇽 MXN', '🇮🇩 IDR', '🇹🇭 THB', '🇻🇳 VND', '🇵🇭 PHP', '₿ BTC', 'Ξ ETH', '◎ SOL', '🟡 BNB'].map(curr => (
                  <button
                    key={curr}
                    className={`text-left px-3 py-2 rounded-lg text-sm hover:bg-[--bg-tertiary] transition-colors ${curr === '🇺🇸 USD' ? 'text-[--accent] font-semibold' : 'text-[--text-secondary]'}`}
                    onClick={() => setCurrModal(false)}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
