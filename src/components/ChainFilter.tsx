'use client'

const CHAINS = [
  { id: 'all', name: 'All Chains', color: '#C8C8D4', icon: '◎' },
  { id: 'solana', name: 'Solana', color: '#9945FF', icon: '◆' },
  { id: 'ethereum', name: 'Ethereum', color: '#627EEA', icon: '⬡' },
  { id: 'base', name: 'Base', color: '#0052FF', icon: '▣' },
  { id: 'bsc', name: 'BSC', color: '#F3BA2F', icon: '◈' },
  { id: 'arbitrum', name: 'Arbitrum', color: '#28A0F0', icon: '△' },
]

export default function ChainFilter({ selected, onChange }: { selected: string; onChange: (chain: string) => void }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CHAINS.map(chain => {
        const isActive = selected === chain.id
        return (
          <button
            key={chain.id}
            onClick={() => onChange(chain.id)}
            className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold font-['Outfit'] transition-all duration-200 flex items-center gap-1.5"
            style={{
              background: isActive ? `${chain.color}12` : 'transparent',
              border: `1px solid ${isActive ? chain.color + '44' : '#1A1A28'}`,
              color: isActive ? chain.color : '#5A5A72',
              boxShadow: isActive ? `0 0 15px ${chain.color}15` : 'none',
            }}
          >
            <span className="text-[10px]">{chain.icon}</span>
            {chain.name}
          </button>
        )
      })}
    </div>
  )
}
