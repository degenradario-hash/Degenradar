'use client'

import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { mockNews, type NewsItem } from '@/lib/mockData'

const CATEGORIES = ['All', 'Bitcoin', 'Ethereum', 'Altcoins', 'DeFi', 'Regulation', 'Macro'] as const

export default function NewsPage() {
  const [category, setCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockNews.filter(item => {
    const matchCategory = category === 'All' || item.category === category
    const matchSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <>
      <TopBar />
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <h1 className="font-heading font-bold text-2xl mb-6">Crypto News</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={category === cat ? 'tab tab-active' : 'tab text-[--text-secondary]'}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search news..."
            className="px-3 py-1.5 text-sm rounded-lg border border-[--border] bg-[--bg-secondary] text-[--text-primary] placeholder-[--text-muted] focus:outline-none focus:border-[--accent] w-48"
          />
        </div>

        {/* News Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[--text-muted]">No news found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(item => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="bg-[--bg-secondary] border border-[--border] rounded-xl overflow-hidden hover:border-[--border-hover] transition-colors group cursor-pointer">
      <div className={`h-40 bg-gradient-to-br ${item.imageGradient} opacity-80`} />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="pill bg-[--accent-muted] text-[--accent] text-[10px]">{item.category}</span>
          <span className="text-[10px] text-[--text-muted]">{item.source}</span>
          <span className="text-[10px] text-[--text-muted] ml-auto">{item.date}</span>
        </div>
        <h3 className="font-heading font-semibold text-base mb-2 group-hover:text-[--accent] transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-[--text-secondary] line-clamp-3">{item.excerpt}</p>
      </div>
    </article>
  )
}
