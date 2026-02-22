'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

const MODULES = [
  { icon: '🔍', name: 'Memecoin Scanner', desc: 'Safety Score & Bundle Detection — never get rugged again', status: 'soon' },
  { icon: '🐋', name: 'Whale Tracker', desc: 'Track smart money moves in real-time — see what whales buy before the crowd', status: 'soon' },
  { icon: '🖨️', name: 'Stablecoin Printer', desc: 'USDT, USDC, PYUSD minting alerts — fresh liquidity = bullish signal', status: 'soon' },
  { icon: '💰', name: 'Safe Yield', desc: 'Compare DeFi yields vs banks — earn 8-12% on stablecoins safely', status: 'soon' },
  { icon: '⚡', name: 'One-Click DeFi', desc: 'Loop SOL 3x in one click — no more 6 manual transactions', status: 'soon' },
  { icon: '🎯', name: 'Prediction Markets', desc: 'Bet on crypto, politics, sports via Polymarket & Kalshi', status: 'soon' },
  { icon: '📡', name: 'DePIN Hub', desc: 'Earn passive income running nodes — Grass, Nodepay, Gradient guides', status: 'soon' },
] as { icon: string; name: string; desc: string; status: 'live' | 'soon' }[]

export default function ModuleCarousel() {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <section className="py-14 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-[32px] lg:text-[40px] mb-3">Explore Our Tools</h2>
          <p className="font-subtitle text-[--text-secondary] text-[16px]">Professional crypto intelligence suite</p>
        </div>

        {/* Outer wrapper: px-16 creates space for arrows OUTSIDE the card area */}
        <div className="relative px-0 md:px-16 lg:px-20">
          {/* Left arrow — positioned OUTSIDE cards in the left margin */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[--bg-secondary] border border-[--border] items-center justify-center text-[--text-primary] text-2xl font-bold cursor-pointer hover:border-[#FFFF00] hover:text-[#FFFF00] transition-colors"
            aria-label="Previous slide"
          >
            &#8249;
          </button>

          {/* Right arrow — positioned OUTSIDE cards in the right margin */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[--bg-secondary] border border-[--border] items-center justify-center text-[--text-primary] text-2xl font-bold cursor-pointer hover:border-[#FFFF00] hover:text-[#FFFF00] transition-colors"
            aria-label="Next slide"
          >
            &#8250;
          </button>

          {/* Overflow hidden container with vertical padding to prevent border clipping */}
          <div className="overflow-hidden py-4">
          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={(swiper) => { swiperRef.current = swiper }}
            spaceBetween={28}
            slidesPerView={1.15}
            centeredSlides={true}
            loop={true}
            grabCursor={true}
            pagination={{ clickable: true }}
            breakpoints={{
              480: { slidesPerView: 1.4, spaceBetween: 24 },
              640: { slidesPerView: 2, spaceBetween: 28 },
              768: { slidesPerView: 2.5, spaceBetween: 28 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
              1280: { slidesPerView: 3, spaceBetween: 36 },
            }}
            className="module-carousel !overflow-visible !py-6 !pb-14"
          >
            {MODULES.map((mod, i) => (
              <SwiperSlide key={i} className="!h-auto">
                {({ isActive }) => (
                  <div
                    className={`bg-[--bg-secondary] border-2 rounded-2xl p-7 min-h-[300px] flex flex-col items-center text-center transition-all duration-300 ease-out ${
                      isActive
                        ? 'border-[#FFFF00] scale-[1.08]'
                        : 'border-[--border] opacity-70 scale-[0.92]'
                    }`}
                    style={isActive ? {
                      boxShadow: '0 0 24px rgba(255, 255, 0, 0.15), 0 0 48px rgba(255, 255, 0, 0.06)',
                    } : undefined}
                  >
                    <span className="text-[56px] leading-none mb-5">{mod.icon}</span>
                    <h3 className="font-heading text-[22px] mb-2">{mod.name}</h3>
                    <p className="text-[--text-secondary] text-[14px] leading-relaxed flex-1">{mod.desc}</p>
                    <div className="mt-5 flex items-center justify-center gap-4 w-full">
                      <span className={`pill text-[11px] ${
                        mod.status === 'live'
                          ? 'bg-[--green]/15 text-[--green]'
                          : 'pill-accent'
                      }`}>
                        {mod.status === 'live' ? 'Live' : 'Coming Soon'}
                      </span>
                      <span className="text-[13px] accent-link cursor-pointer transition-colors">
                        Learn more &rarr;
                      </span>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .module-carousel .swiper-wrapper {
          align-items: center;
          overflow: visible !important;
        }
        .module-carousel .swiper-button-next,
        .module-carousel .swiper-button-prev {
          display: none !important;
        }
        .module-carousel .swiper-pagination-bullet {
          background: var(--text-muted);
          opacity: 0.5;
          width: 8px;
          height: 8px;
        }
        .module-carousel .swiper-pagination-bullet-active {
          background: var(--accent);
          opacity: 1;
        }
      `}</style>
    </section>
  )
}
