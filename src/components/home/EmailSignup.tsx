'use client'

import { useState } from 'react'

export default function EmailSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <section className="py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="bg-[--bg-secondary] border border-[--accent]/30 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="font-heading font-bold text-2xl lg:text-3xl mb-2">
            Stay ahead of the market
          </h2>
          <p className="text-[--text-muted] text-sm mb-6">
            Get weekly alpha, whale alerts, and market analysis
          </p>

          {submitted ? (
            <div className="text-[--green] font-medium">
              Thanks for subscribing! We&apos;ll keep you posted.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-2.5 rounded-lg border border-[--border] bg-[--bg-tertiary] text-[--text-primary] placeholder-[--text-muted] focus:outline-none focus:border-[--accent] text-sm"
              />
              <button
                type="submit"
                className="btn-accent btn px-6 border-0 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[10px] text-[--text-muted] mt-4">
            Join 0 degens &middot; No spam, unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  )
}
