export interface NewsItem {
  id: number
  title: string
  category: 'Bitcoin' | 'Ethereum' | 'Altcoins' | 'DeFi' | 'Regulation' | 'Macro'
  date: string
  excerpt: string
  source: string
  imageGradient: string
}

export interface BlogPost {
  id: number
  title: string
  category: 'Guide' | 'Analysis' | 'Tutorial' | 'News' | 'Opinion'
  date: string
  readTime: string
  excerpt: string
  featured: boolean
  imageGradient: string
}

export const mockNews: NewsItem[] = [
  { id: 1, title: 'Bitcoin Eyes $100K as Institutional Inflows Surge', category: 'Bitcoin', date: '2026-02-21', excerpt: 'Major institutional investors continue accumulating BTC as spot ETF inflows hit record levels.', source: 'CoinDesk', imageGradient: 'from-orange-500 to-yellow-500' },
  { id: 2, title: 'Ethereum L2 Activity Hits All-Time High', category: 'Ethereum', date: '2026-02-21', excerpt: 'Base, Arbitrum, and Optimism see record transaction volumes as scaling solutions mature.', source: 'The Block', imageGradient: 'from-blue-500 to-purple-500' },
  { id: 3, title: 'SEC Approves New Crypto ETF Framework', category: 'Regulation', date: '2026-02-20', excerpt: 'The regulatory landscape shifts as new guidelines emerge for digital asset products.', source: 'Bloomberg', imageGradient: 'from-gray-500 to-gray-700' },
  { id: 4, title: 'Solana DeFi TVL Crosses $15 Billion', category: 'DeFi', date: '2026-02-20', excerpt: 'Kamino, Marinade, and Jupiter drive unprecedented growth in Solana DeFi ecosystem.', source: 'DeFi Llama', imageGradient: 'from-purple-500 to-pink-500' },
  { id: 5, title: 'New Memecoin Season? Top 10 Movers This Week', category: 'Altcoins', date: '2026-02-19', excerpt: 'Community tokens surge as social media activity reaches new highs across major platforms.', source: 'CryptoSlate', imageGradient: 'from-green-500 to-teal-500' },
  { id: 6, title: 'Fed Signals Rate Cuts Could Boost Risk Assets', category: 'Macro', date: '2026-02-19', excerpt: 'Federal Reserve meeting minutes suggest a dovish pivot may be on the horizon.', source: 'Reuters', imageGradient: 'from-red-500 to-orange-500' },
  { id: 7, title: 'Base Chain Overtakes Arbitrum in Daily Active Users', category: 'Ethereum', date: '2026-02-18', excerpt: 'Coinbase L2 continues rapid adoption with over 2M daily active addresses.', source: 'Dune Analytics', imageGradient: 'from-blue-600 to-blue-400' },
  { id: 8, title: 'Whale Alert: $500M BTC Moved to Cold Storage', category: 'Bitcoin', date: '2026-02-18', excerpt: 'On-chain data reveals massive accumulation pattern from institutional-sized wallets.', source: 'Whale Alert', imageGradient: 'from-yellow-600 to-orange-400' },
  { id: 9, title: 'Aave V4 Launches with Cross-Chain Lending', category: 'DeFi', date: '2026-02-17', excerpt: 'The next generation of DeFi lending enables seamless borrowing across multiple networks.', source: 'The Defiant', imageGradient: 'from-cyan-500 to-blue-500' },
  { id: 10, title: 'Japan Unveils Comprehensive Crypto Tax Reform', category: 'Regulation', date: '2026-02-17', excerpt: 'New framework reduces capital gains tax on digital assets to attract global crypto firms.', source: 'Nikkei', imageGradient: 'from-red-600 to-pink-500' },
  { id: 11, title: 'Stablecoin Market Cap Reaches $200B Milestone', category: 'DeFi', date: '2026-02-16', excerpt: 'USDT and USDC lead the charge as institutional demand for on-chain dollars grows.', source: 'CoinGecko', imageGradient: 'from-green-600 to-emerald-400' },
  { id: 12, title: 'Top DePIN Projects to Watch in 2026', category: 'Altcoins', date: '2026-02-16', excerpt: 'Helium, Render, and Grass lead the decentralized physical infrastructure narrative.', source: 'Messari', imageGradient: 'from-indigo-500 to-violet-500' },
  { id: 13, title: 'Bitcoin Mining Difficulty Reaches New All-Time High', category: 'Bitcoin', date: '2026-02-15', excerpt: 'Hash rate continues climbing as next-gen ASIC miners come online globally.', source: 'CoinTelegraph', imageGradient: 'from-amber-500 to-yellow-600' },
  { id: 14, title: 'Polygon zkEVM Sees 300% Growth in TVL', category: 'Ethereum', date: '2026-02-15', excerpt: 'Zero-knowledge rollup technology proves its worth with major protocol migrations.', source: 'L2Beat', imageGradient: 'from-purple-600 to-indigo-500' },
  { id: 15, title: 'Crypto Market Outlook: What Analysts Expect for Q2', category: 'Macro', date: '2026-02-14', excerpt: 'Major banks and research firms weigh in on the direction of digital assets.', source: 'Galaxy Digital', imageGradient: 'from-slate-500 to-slate-700' },
]

export const mockBlogPosts: BlogPost[] = [
  { id: 1, title: 'How to Spot a Rug Pull in 30 Seconds', category: 'Guide', date: '2026-02-18', readTime: '5 min', excerpt: 'Learn the key red flags that separate legitimate projects from scams. Check liquidity locks, contract verification, and holder distribution before you ape in.', featured: true, imageGradient: 'from-red-500 to-orange-500' },
  { id: 2, title: 'Best DeFi Yields in 2026 — Safe Options Compared', category: 'Analysis', date: '2026-02-15', readTime: '8 min', excerpt: 'We compared Aave, Kamino, Morpho, and traditional savings rates. Here\'s where you can earn 8-12% without degen-level risk.', featured: false, imageGradient: 'from-green-500 to-teal-500' },
  { id: 3, title: 'Beginner\'s Guide to Memecoin Trading', category: 'Tutorial', date: '2026-02-12', readTime: '12 min', excerpt: 'Everything you need to know about buying, selling, and evaluating memecoins. From Raydium to safety scoring.', featured: false, imageGradient: 'from-yellow-500 to-amber-500' },
  { id: 4, title: 'Understanding Safety Scores: How We Rate Tokens', category: 'Guide', date: '2026-02-10', readTime: '6 min', excerpt: 'Deep dive into our safety scoring methodology. Learn what liquidity, contract verification, and holder analysis reveal.', featured: false, imageGradient: 'from-blue-500 to-cyan-500' },
  { id: 5, title: 'Solana vs Base: Where to Trade Memecoins in 2026', category: 'Analysis', date: '2026-02-08', readTime: '7 min', excerpt: 'Comparing fees, speed, liquidity depth, and user experience between the two hottest memecoin chains.', featured: false, imageGradient: 'from-purple-500 to-pink-500' },
  { id: 6, title: 'How to Read On-Chain Data Like a Pro', category: 'Tutorial', date: '2026-02-05', readTime: '10 min', excerpt: 'Wallet tracking, token flow analysis, and whale watching techniques that give you an edge.', featured: false, imageGradient: 'from-indigo-500 to-blue-500' },
  { id: 7, title: 'The Bull Case for DePIN in 2026', category: 'Opinion', date: '2026-02-02', readTime: '6 min', excerpt: 'Why decentralized physical infrastructure networks could be the next major crypto narrative.', featured: false, imageGradient: 'from-emerald-500 to-green-500' },
  { id: 8, title: 'Stablecoin Yield Strategies for Conservative Investors', category: 'Guide', date: '2026-01-28', readTime: '9 min', excerpt: 'A risk-adjusted approach to earning yield on USDC and USDT across multiple protocols.', featured: false, imageGradient: 'from-slate-500 to-gray-500' },
]
