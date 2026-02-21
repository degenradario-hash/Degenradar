'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import TopBar from '@/components/layout/TopBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Sparkline from '@/components/Sparkline'
import SafetyRing from '@/components/SafetyRing'
import { formatPrice, formatBigNumber, formatPercent } from '@/lib/formatters'
import { getChainName, getChainColor, getTokenByAddress } from '@/lib/dexscreener'

interface TokenData {
  name: string
  symbol: string
  image?: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  circulatingSupply?: number
  totalSupply?: number
  ath?: number
  athDate?: string
  atl?: number
  atlDate?: string
  rank?: number
  liquidity?: number
  sparkline?: number[]
  description?: string
  links?: { homepage?: string[]; twitter?: string; telegram?: string; github?: string[] }
  chain?: string
  safetyScore?: { score: number; flags: string[] }
  dexUrl?: string
}

export default function TokenPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const chain = searchParams.get('chain')
  const [token, setToken] = useState<TokenData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchToken() {
      setLoading(true)
      try {
        if (chain) {
          // DEX token
          const pairs = await getTokenByAddress(chain, id)
          if (pairs.length > 0) {
            const p = pairs[0]
            setToken({
              name: p.baseToken?.name || id,
              symbol: p.baseToken?.symbol || '',
              price: parseFloat(p.priceUsd || '0'),
              change24h: p.priceChange?.h24 || 0,
              marketCap: p.marketCap || p.fdv || 0,
              volume24h: p.volume?.h24 || 0,
              liquidity: p.liquidity?.usd,
              chain: p.chainId,
              dexUrl: p.url,
              safetyScore: { score: 50, flags: [] }, // placeholder
            })
          }
        } else {
          // CoinGecko token
          const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`)
          if (res.ok) {
            const d = await res.json()
            setToken({
              name: d.name,
              symbol: d.symbol,
              image: d.image?.large || d.image?.small,
              price: d.market_data?.current_price?.usd || 0,
              change24h: d.market_data?.price_change_percentage_24h || 0,
              marketCap: d.market_data?.market_cap?.usd || 0,
              volume24h: d.market_data?.total_volume?.usd || 0,
              circulatingSupply: d.market_data?.circulating_supply,
              totalSupply: d.market_data?.total_supply,
              ath: d.market_data?.ath?.usd,
              athDate: d.market_data?.ath_date?.usd?.split('T')[0],
              atl: d.market_data?.atl?.usd,
              atlDate: d.market_data?.atl_date?.usd?.split('T')[0],
              rank: d.market_cap_rank,
              sparkline: d.market_data?.sparkline_7d?.price,
              description: d.description?.en?.split('. ').slice(0, 3).join('. ') + '.',
              links: {
                homepage: d.links?.homepage?.filter(Boolean),
                twitter: d.links?.twitter_screen_name ? `https://twitter.com/${d.links.twitter_screen_name}` : undefined,
                telegram: d.links?.telegram_channel_identifier ? `https://t.me/${d.links.telegram_channel_identifier}` : undefined,
                github: d.links?.repos_url?.github?.filter(Boolean),
              },
            })
          }
        }
      } catch {
        // ignore
      }
      setLoading(false)
    }
    fetchToken()
  }, [id, chain])

  const p24h = formatPercent(token?.change24h)

  return (
    <>
      <TopBar />
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <Link href={chain ? '/dexscan' : '/markets'} className="text-sm text-[--text-muted] hover:text-[--accent] mb-4 inline-block">
          &larr; Back to {chain ? 'DexScan' : 'Markets'}
        </Link>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : !token ? (
          <div className="text-center py-20 text-[--text-muted]">Token not found</div>
        ) : (
          <>
            {/* Token Header */}
            <div className="flex items-center gap-4 mb-8">
              {token.image && <img src={token.image} alt={token.name} className="w-16 h-16 rounded-full" />}
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-heading font-bold text-2xl">{token.name}</h1>
                  <span className="text-[--text-muted] text-sm uppercase">{token.symbol}</span>
                  {token.chain && (
                    <span
                      className="pill text-[10px] border"
                      style={{
                        borderColor: `${getChainColor(token.chain)}50`,
                        color: getChainColor(token.chain),
                        background: `${getChainColor(token.chain)}12`,
                      }}
                    >
                      {getChainName(token.chain)}
                    </span>
                  )}
                  {token.rank && (
                    <span className="pill bg-[--bg-tertiary] text-[--text-secondary] text-[10px]">
                      Rank #{token.rank}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="mono text-3xl font-bold">{formatPrice(token.price)}</span>
                  <span className={`pill mono text-sm ${p24h.isPositive ? 'bg-[--green]/15 text-[--green]' : p24h.isNegative ? 'bg-[--red]/15 text-[--red]' : 'bg-[--bg-tertiary] text-[--text-muted]'}`}>
                    {p24h.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-[--bg-secondary] border border-[--border] rounded-xl mb-8 overflow-hidden">
              <div className="flex gap-2 p-4 border-b border-[--border]">
                {['1H', '4H', '1D', '1W', '1M', '1Y', 'ALL'].map((interval, i) => (
                  <button
                    key={interval}
                    className={`px-3 py-1 text-xs rounded-lg font-medium ${
                      i === 2 ? 'bg-[--accent] text-black' : 'text-[--text-muted] hover:text-[--text-primary]'
                    }`}
                  >
                    {interval}
                  </button>
                ))}
              </div>
              {token.sparkline ? (
                <div className="p-4">
                  <Sparkline data={token.sparkline} width={800} height={200} showGradient className="w-full" />
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-[--text-muted] bg-[--bg-tertiary]/50">
                  Chart coming soon
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Market Cap', value: formatBigNumber(token.marketCap) },
                { label: '24h Volume', value: formatBigNumber(token.volume24h) },
                { label: 'Circulating Supply', value: token.circulatingSupply ? `${formatBigNumber(token.circulatingSupply).replace('$', '')}` : '—' },
                { label: 'Total Supply', value: token.totalSupply ? `${formatBigNumber(token.totalSupply).replace('$', '')}` : '—' },
                { label: 'All-Time High', value: token.ath ? formatPrice(token.ath) : '—', sub: token.athDate },
                { label: 'All-Time Low', value: token.atl ? formatPrice(token.atl) : '—', sub: token.atlDate },
                { label: 'Market Cap Rank', value: token.rank ? `#${token.rank}` : '—' },
                { label: 'Liquidity', value: token.liquidity ? formatBigNumber(token.liquidity) : '—' },
              ].map(stat => (
                <div key={stat.label} className="bg-[--bg-secondary] border border-[--border] rounded-xl p-4">
                  <div className="text-xs text-[--text-muted] mb-1">{stat.label}</div>
                  <div className="mono font-bold">{stat.value}</div>
                  {(stat as any).sub && <div className="text-[10px] text-[--text-muted] mt-0.5">{(stat as any).sub}</div>}
                </div>
              ))}
            </div>

            {/* Description */}
            {token.description && (
              <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-6 mb-8">
                <h3 className="font-heading font-bold text-lg mb-3">About {token.name}</h3>
                <p className="text-sm text-[--text-secondary] leading-relaxed">{token.description}</p>
                {token.links && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {token.links.homepage?.[0] && (
                      <a href={token.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="btn text-xs">Website</a>
                    )}
                    {token.links.twitter && (
                      <a href={token.links.twitter} target="_blank" rel="noopener noreferrer" className="btn text-xs">Twitter</a>
                    )}
                    {token.links.telegram && (
                      <a href={token.links.telegram} target="_blank" rel="noopener noreferrer" className="btn text-xs">Telegram</a>
                    )}
                    {token.links.github?.[0] && (
                      <a href={token.links.github[0]} target="_blank" rel="noopener noreferrer" className="btn text-xs">GitHub</a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Safety Score (DEX tokens) */}
            {token.safetyScore && (
              <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-6 mb-8">
                <h3 className="font-heading font-bold text-lg mb-4">Safety Score</h3>
                <SafetyRing score={token.safetyScore.score} size="lg" flags={token.safetyScore.flags} showFlags />
              </div>
            )}

            {/* DEX link */}
            {token.dexUrl && (
              <div className="text-center">
                <a href={token.dexUrl} target="_blank" rel="noopener noreferrer" className="btn-accent btn inline-block border-0">
                  View on DexScreener &rarr;
                </a>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
