'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage("You're in! We'll notify you when we launch. 🚀");
        setEmail('');
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFFF00]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 mb-8">
        <Image src="/nobg3.png" alt="DegenRadar" width={500} height={204} className="w-[320px] md:w-[450px] h-auto" priority />
      </div>

      <h1 className="relative z-10 text-3xl md:text-5xl font-bold text-white text-center max-w-3xl leading-tight mb-4">
        The Ultimate <span className="text-[#FFFF00]">Degen Command Center</span> Is Coming
      </h1>

      <p className="relative z-10 text-lg md:text-xl text-gray-400 text-center max-w-2xl mb-2">
        Tools to outsmart whales, front-run the herd, and leave normies behind.
      </p>
      <p className="relative z-10 text-base text-gray-500 text-center max-w-xl mb-10">
        While others guess, you&apos;ll know. Early access dropping soon.
      </p>

      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md flex flex-col sm:flex-row gap-3">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFFF00] transition-colors" />
        <button type="submit" disabled={status === 'loading'} className="px-6 py-3 bg-[#FFFF00] text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors whitespace-nowrap disabled:opacity-50">
          {status === 'loading' ? 'Joining...' : 'Get Early Access'}
        </button>
      </form>

      {message && (
        <p className={`relative z-10 text-sm text-center mt-3 ${status === 'success' ? 'text-[#FFFF00]' : 'text-red-400'}`}>{message}</p>
      )}

      <div className="relative z-10 mt-16 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl w-full">
        <div className="text-center p-4">
          <span className="text-3xl mb-2 block">🔍</span>
          <h3 className="text-white font-bold text-sm mb-1">Memecoin Scanner</h3>
          <p className="text-gray-500 text-xs">Safety scores & rug detection</p>
        </div>
        <div className="text-center p-4">
          <span className="text-3xl mb-2 block">🐋</span>
          <h3 className="text-white font-bold text-sm mb-1">Whale Mirror Mode</h3>
          <p className="text-gray-500 text-xs">Copy whale trades in real-time</p>
        </div>
        <div className="text-center p-4">
          <span className="text-3xl mb-2 block">🖨️</span>
          <h3 className="text-white font-bold text-sm mb-1">Stablecoin Printer</h3>
          <p className="text-gray-500 text-xs">USDT/USDC minting alerts</p>
        </div>
        <div className="text-center p-4">
          <span className="text-3xl mb-2 block">💰</span>
          <h3 className="text-white font-bold text-sm mb-1">Safe Yield</h3>
          <p className="text-gray-500 text-xs">DeFi yields vs banks compared</p>
        </div>
        <div className="text-center p-4">
          <span className="text-3xl mb-2 block">⚡</span>
          <h3 className="text-white font-bold text-sm mb-1">One-Click DeFi</h3>
          <p className="text-gray-500 text-xs">Complex DeFi strategies simplified</p>
        </div>
        <div className="text-center p-4">
          <span className="text-3xl mb-2 block">🎯</span>
          <h3 className="text-white font-bold text-sm mb-1">Prediction Markets</h3>
          <p className="text-gray-500 text-xs">Polymarket & Kalshi bets</p>
        </div>
        <div className="text-center p-4">
          <span className="text-3xl mb-2 block">📡</span>
          <h3 className="text-white font-bold text-sm mb-1">DePIN Hub</h3>
          <p className="text-gray-500 text-xs">Passive income from nodes</p>
        </div>
        <div className="text-center p-4">
          <span className="text-3xl mb-2 block">💎</span>
          <h3 className="text-white font-bold text-sm mb-1">Fee Tracker</h3>
          <p className="text-gray-500 text-xs">Cashback vs Creator Fee stats</p>
        </div>
        <div className="text-center p-4">
          <span className="text-3xl mb-2 block">🏆</span>
          <h3 className="text-white font-bold text-sm mb-1">Tier Scanner</h3>
          <p className="text-gray-500 text-xs">Auto token classification</p>
        </div>
        <div className="text-center p-4">
          <span className="text-3xl mb-2 block">💼</span>
          <h3 className="text-white font-bold text-sm mb-1">Crypto Jobs</h3>
          <p className="text-gray-500 text-xs">Web3 job board</p>
        </div>
      </div>

      <div className="relative z-10 mt-12 mb-8">
        <a href="https://twitter.com/DegenRadarHQ" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#FFFF00] transition-colors text-sm font-bold">𝕏 Twitter</a>
      </div>

      <p className="relative z-10 text-gray-700 text-xs mb-4">© 2026 DegenRadar.io — All rights reserved</p>
    </div>
  );
}