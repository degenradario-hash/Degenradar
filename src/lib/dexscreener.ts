// DexScreener API - free, no API key needed
const DEXSCREENER_BASE = 'https://api.dexscreener.com/latest/dex'

export interface TokenPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  priceNative: string
  priceUsd: string
  txns: {
    m5: { buys: number; sells: number }
    h1: { buys: number; sells: number }
    h6: { buys: number; sells: number }
    h24: { buys: number; sells: number }
  }
  volume: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  priceChange: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  liquidity?: {
    usd: number
    base: number
    quote: number
  }
  fdv?: number
  marketCap?: number
  pairCreatedAt?: number
  info?: {
    imageUrl?: string
    websites?: { label: string; url: string }[]
    socials?: { type: string; url: string }[]
  }
}

export interface DexSearchResponse {
  pairs: TokenPair[]
}

// Search tokens by keyword
export async function searchTokens(query: string): Promise<TokenPair[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/search?q=${encodeURIComponent(query)}`, {
      next: { revalidate: 30 }
    })
    if (!res.ok) return []
    const data: DexSearchResponse = await res.json()
    return data.pairs || []
  } catch {
    return []
  }
}

// Get trending/latest tokens on specific chains
export async function getTrendingTokens(chain: string = 'solana'): Promise<TokenPair[]> {
  try {
    // DexScreener doesn't have a "trending" endpoint directly,
    // but we can search for recently created pairs with volume
    const res = await fetch(`https://api.dexscreener.com/token-boosts/latest/v1`, {
      next: { revalidate: 60 }
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// Get token pairs by token address
export async function getTokenByAddress(chain: string, address: string): Promise<TokenPair[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/tokens/${address}`, {
      next: { revalidate: 15 }
    })
    if (!res.ok) return []
    const data: DexSearchResponse = await res.json()
    return data.pairs || []
  } catch {
    return []
  }
}

// Get latest token profiles (new tokens with metadata)
export async function getLatestTokenProfiles(): Promise<any[]> {
  try {
    const res = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
      next: { revalidate: 60 }
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// Format helpers
export function formatUsd(value: number | undefined): string {
  if (!value) return '$0'
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  if (value >= 1) return `$${value.toFixed(2)}`
  if (value >= 0.0001) return `$${value.toFixed(4)}`
  return `$${value.toFixed(8)}`
}

export function formatNumber(value: number | undefined): string {
  if (!value) return '0'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(0)
}

export function formatAge(createdAt: number | undefined): string {
  if (!createdAt) return '?'
  const diff = Date.now() - createdAt
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  return `${Math.floor(days / 30)}mo`
}

export function getChainName(chainId: string): string {
  const chains: Record<string, string> = {
    solana: 'SOL',
    ethereum: 'ETH',
    bsc: 'BSC',
    base: 'BASE',
    arbitrum: 'ARB',
    polygon: 'POLY',
    avalanche: 'AVAX',
  }
  return chains[chainId] || chainId.toUpperCase()
}

export function getChainColor(chainId: string): string {
  const colors: Record<string, string> = {
    solana: '#9945FF',
    ethereum: '#627EEA',
    bsc: '#F3BA2F',
    base: '#0052FF',
    arbitrum: '#28A0F0',
    polygon: '#8247E5',
    avalanche: '#E84142',
  }
  return colors[chainId] || '#888888'
}
