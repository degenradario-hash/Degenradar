import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="relative z-50 overflow-visible bg-[#0A0A0F] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center h-16">

          {/* KONTENER LOGO - Magia "Notch" */}
          <div className="relative flex-shrink-0 flex items-center z-50 h-24 -mt-6">
            <Link href="/" className="block">
              <Image
                src="/logo_no_background.png"
                alt="DegenRadar Logo"
                width={200}
                height={80}
                className="h-20 w-auto object-contain drop-shadow-lg"
                priority
              />
            </Link>
          </div>

          {/* Prawa strona nawigacji */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <Link href="/markets" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Markets</Link>
              <Link href="/dexscan" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">DexScan</Link>
              <Link href="/news" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">News</Link>
            </nav>

            <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md font-bold text-sm transition-colors">
              Connect
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
