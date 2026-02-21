'use client'

import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { mockBlogPosts, type BlogPost } from '@/lib/mockData'

const CATEGORIES = ['All', 'Guide', 'Analysis', 'Tutorial', 'Opinion'] as const

export default function BlogPage() {
  const [category, setCategory] = useState<string>('All')

  const featured = mockBlogPosts.find(p => p.featured)
  const posts = mockBlogPosts.filter(p => {
    if (category === 'All') return true
    return p.category === category
  })

  return (
    <>
      <TopBar />
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <h1 className="font-heading font-bold text-2xl mb-6">Blog</h1>

        {/* Category filter */}
        <div className="flex gap-1.5 flex-wrap mb-8">
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

        {/* Featured Post */}
        {featured && (category === 'All' || featured.category === category) && (
          <article className="bg-[--bg-secondary] border border-[--border] rounded-xl overflow-hidden mb-8 hover:border-[--border-hover] transition-colors group cursor-pointer">
            <div className="md:flex">
              <div className={`h-48 md:h-auto md:w-[400px] bg-gradient-to-br ${featured.imageGradient} opacity-80 shrink-0`} />
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="pill bg-[--accent-muted] text-[--accent] text-[10px]">{featured.category}</span>
                  <span className="text-[10px] text-[--text-muted]">{featured.readTime} read</span>
                  <span className="pill bg-[--accent] text-black text-[10px]">Featured</span>
                </div>
                <h2 className="font-heading font-bold text-xl lg:text-2xl mb-3 group-hover:text-[--accent] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-sm text-[--text-secondary] leading-relaxed mb-4">{featured.excerpt}</p>
                <div className="text-xs text-[--text-muted]">{featured.date}</div>
              </div>
            </div>
          </article>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts
            .filter(p => !p.featured || category !== 'All')
            .map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 text-[--text-muted]">No articles found</div>
        )}
      </main>
      <Footer />
    </>
  )
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-[--bg-secondary] border border-[--border] rounded-xl overflow-hidden hover:border-[--border-hover] transition-colors group cursor-pointer flex flex-col">
      <div className={`h-36 bg-gradient-to-br ${post.imageGradient} opacity-80`} />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="pill bg-[--accent-muted] text-[--accent] text-[10px]">{post.category}</span>
          <span className="text-[10px] text-[--text-muted]">{post.readTime} read</span>
        </div>
        <h3 className="font-heading font-semibold text-base mb-2 group-hover:text-[--accent] transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-[--text-secondary] line-clamp-3 flex-1">{post.excerpt}</p>
        <div className="text-xs text-[--text-muted] mt-3">{post.date}</div>
      </div>
    </article>
  )
}
