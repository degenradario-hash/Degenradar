import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full relative z-50 flex flex-col bg-transparent">
      {/* TOP ROW: Nav bar height (h-16) */}
      <div className="flex w-full h-16">
        {/* Logo background placeholder - NO borders here */}
        <div className="w-[260px] md:w-[320px] flex-shrink-0 bg-[#0A0A0F]"></div>

        {/* Nav links container - Bottom border only */}
        <div className="flex-1 bg-[#0A0A0F] border-b border-gray-400 flex items-center justify-between px-8">
          <nav className="hidden md:flex space-x-10">
            <Link href="/markets" className="text-xl font-bold text-white hover:text-yellow-400 transition-colors">Markets</Link>
            <Link href="/exchanges" className="text-xl font-bold text-white hover:text-yellow-400 transition-colors">Exchanges</Link>
            <Link href="/dexscan" className="text-xl font-bold text-white hover:text-yellow-400 transition-colors">DexScan</Link>
          </nav>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-md font-bold text-sm transition-colors">
            Connect
          </button>
        </div>
      </div>

      {/* BOTTOM ROW: The structural notch (h-8) */}
      <div className="flex w-full h-8">
        {/* The Notch - Right and Bottom border perfectly connecting to the nav border */}
        <div className="w-[260px] md:w-[320px] flex-shrink-0 bg-[#0A0A0F] border-b border-r border-gray-400 rounded-br-xl"></div>
        {/* Empty transparent space under the navigation */}
        <div className="flex-1 bg-transparent"></div>
      </div>

      {/* LOGO IMAGE - Clean, naturally fitted without CSS hacks */}
      <div className="absolute top-0 left-0 w-[260px] md:w-[320px] h-24 flex items-center justify-center pointer-events-none">
        {/* Natural padding restored so it breathes inside the box */}
        <Link href="/" className="pointer-events-auto w-full h-full flex items-center justify-start py-2 pl-6 pr-4">
          <Image
            src="/nobg3.png"
            alt="DegenRadar Logo"
            width={300}
            height={96}
            className="w-full h-full object-contain drop-shadow-lg"
            unoptimized={true} 
            priority
          />
        </Link>
      </div>
    </header>
  );
}