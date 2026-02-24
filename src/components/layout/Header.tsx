import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-[#0A0A0F]">
      {/* Główny kontener trzymający wysokość całości (h-24) */}
      <div className="relative w-full h-24">

        {/* 1. Tło i dolna linia całego paska nawigacji (h-16) */}
        {/* Ta linia ciągnie się od prawej do lewej, ale jej lewa część zostanie przykryta przez logo */}
        <div className="absolute top-0 left-0 w-full h-16 border-b border-gray-400 bg-[#0A0A0F] z-10"></div>

        {/* 2. Pudełko na LOGO - wyższe (h-24) */}
        {/* Leży na wierzchu, ma swoje obramowanie (dół i prawy bok + zaokrąglenie). Czarne tło maskuje pasek pod nim! */}
        <div className="absolute top-0 left-0 h-24 w-[280px] md:w-[320px] bg-[#0A0A0F] border-b border-r border-gray-400 rounded-br-2xl flex items-center justify-center z-30">
          <Link href="/" className="block w-full px-6">
            <Image
              src="/noobg.png"
              alt="DegenRadar Logo"
              width={240}
              height={80}
              className="h-16 w-auto object-contain drop-shadow-lg"
              priority
            />
          </Link>
        </div>

        {/* 3. Kontener na linki - przesunięty w prawo, żeby nie wchodził pod logo */}
        <div className="absolute top-0 right-0 h-16 w-[calc(100%-280px)] md:w-[calc(100%-320px)] flex items-center justify-between px-8 z-20">
          <nav className="hidden md:flex space-x-10">
            <Link href="/markets" className="text-xl font-bold text-white hover:text-yellow-400 transition-colors">Markets</Link>
            <Link href="/exchanges" className="text-xl font-bold text-white hover:text-yellow-400 transition-colors">Exchanges</Link>
            <Link href="/dexscan" className="text-xl font-bold text-white hover:text-yellow-400 transition-colors">DexScan</Link>
          </nav>

          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-2 rounded-md font-bold text-sm transition-colors ml-auto">
            Connect
          </button>
        </div>

      </div>
    </header>
  );
}