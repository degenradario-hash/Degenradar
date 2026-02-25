'use client';

import { useState, useEffect } from 'react';

const DASHBOARD_PASSWORD = 'degenradar2026';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('dr-auth');
    if (saved === 'true') setAuthenticated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DASHBOARD_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem('dr-auth', 'true');
    } else {
      setError('Wrong password');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
          <h2 className="text-white text-xl font-bold text-center">Dashboard Access</h2>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="px-4 py-3 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFFF00]" />
          <button type="submit" className="px-6 py-3 bg-[#FFFF00] text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors">Enter</button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>
      </div>
    );
  }

  return <>{children}</>;
}