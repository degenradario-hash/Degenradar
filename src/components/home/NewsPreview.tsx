import Link from 'next/link'
import { mockNews } from '@/lib/mockData'

export default function NewsPreview() {
  const latestNews = mockNews.slice(0, 4)

  return (
    <section className="py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl lg:text-2xl">Latest News</h2>
          <Link
            href="/news"
            className="text-sm accent-link font-medium transition-colors"
          >
            Read More News &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestNews.map(item => (
            <article
              key={item.id}
              className="bg-[--bg-secondary] border border-[--border] rounded-xl overflow-hidden hover:border-[--border-hover] transition-colors group"
            >
              <div className={`h-32 bg-gradient-to-br ${item.imageGradient} opacity-80`} />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="pill pill-accent text-[10px]">{item.category}</span>
                  <span className="text-[10px] text-[--text-muted]">{item.date}</span>
                </div>
                <h3 className="font-medium text-sm mb-1.5 line-clamp-2 group-hover:text-[--accent] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[--text-muted] line-clamp-2">{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
