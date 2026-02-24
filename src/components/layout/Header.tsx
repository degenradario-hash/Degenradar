import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full relative z-50 flex flex-col bg-transparent">
      <div className="flex w-full h-20">
        <div className="w-[450px] md:w-[520px] flex-shrink-0 bg-[#0A0A0F]"></div>
        <div className="flex-1 bg-[#0A0A0F] border-b border-gray-400 flex items-center justify-between px-8">
          <nav className="hidden md:flex space-x-8">
            <Link href="/markets" className="text-base font-bold text-white hover:text-yellow-400 transition-colors">Markets</Link>
            <Link href="/exchanges" className="text-base font-bold text-white hover:text-yellow-400 transition-colors">Exchanges</Link>
            <Link href="/dexscan" className="text-base font-bold text-white hover:text-yellow-400 transition-colors">DexScan</Link>
            <Link href="/news" className="text-base font-bold text-white hover:text-yellow-400 transition-colors">News</Link>
            <Link href="/blog" className="text-base font-bold text-white hover:text-yellow-400 transition-colors">Blog</Link>
          </nav>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-md font-bold text-sm transition-colors">
            Connect
          </button>
        </div>
      </div>
      <div className="flex w-full h-12">
        <div className="w-[450px] md:w-[520px] flex-shrink-0 bg-[#0A0A0F] border-b border-r border-gray-400 rounded-br-xl"></div>
        <div className="flex-1 bg-transparent"></div>
      </div>
      <div className="absolute top-0 left-0 w-[450px] md:w-[520px] h-[128px] flex items-center pointer-events-none">
        <Link href="/" className="pointer-events-auto flex items-center h-full w-full pl-2 pr-2">
          <Image
            src="/nobg3.png"
            alt="DegenRadar"
            width={500}
            height={204}
            className="w-full h-auto max-h-[120px] object-contain drop-shadow-lg"
            priority
          />
        </Link>
      </div>
    </header>
  );
}