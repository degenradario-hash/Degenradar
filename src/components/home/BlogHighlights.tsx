import Link from 'next/link'
import { mockBlogPosts } from '@/lib/mockData'

export default function BlogHighlights() {
  const featured = mockBlogPosts.filter(p => p.featured)[0]
  const others = mockBlogPosts.filter(p => !p.featured).slice(0, 2)

  return (
    <section className="py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl lg:text-2xl">From the Blog</h2>
          <Link
            href="/blog"
            className="text-sm accent-link font-medium transition-colors"
          >
            Explore All Articles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Featured */}
          {featured && (
            <article className="lg:row-span-2 bg-[--bg-secondary] border border-[--border] rounded-xl overflow-hidden hover:border-[--border-hover] transition-colors group">
              <div className={`h-48 lg:h-56 bg-gradient-to-br ${featured.imageGradient} opacity-80`} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="pill pill-accent text-[10px]">{featured.category}</span>
                  <span className="text-[10px] text-[--text-muted]">{featured.readTime}</span>
                </div>
                <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-[--accent] transition-colors">
                  {featured.title}
                </h3>
                <p className="text-sm text-[--text-secondary] line-clamp-3">{featured.excerpt}</p>
                <div className="mt-3 text-xs text-[--text-muted]">{featured.date}</div>
              </div>
            </article>
          )}

          {/* Other posts */}
          {others.map(post => (
            <article
              key={post.id}
              className="bg-[--bg-secondary] border border-[--border] rounded-xl overflow-hidden hover:border-[--border-hover] transition-colors group flex flex-col"
            >
              <div className={`h-32 bg-gradient-to-br ${post.imageGradient} opacity-80`} />
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="pill pill-accent text-[10px]">{post.category}</span>
                  <span className="text-[10px] text-[--text-muted]">{post.readTime}</span>
                </div>
                <h3 className="font-medium text-sm mb-1.5 group-hover:text-[--accent] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-[--text-muted] line-clamp-2 flex-1">{post.excerpt}</p>
                <div className="mt-2 text-xs text-[--text-muted]">{post.date}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
