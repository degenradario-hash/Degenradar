import TopBar from '@/components/layout/TopBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroBackground from '@/components/home/HeroBackground'
import MarketOverviewCards from '@/components/home/MarketOverviewCards'
import ModuleCarousel from '@/components/home/ModuleCarousel'
import MarketsPreview from '@/components/home/MarketsPreview'
import NewsPreview from '@/components/home/NewsPreview'
import BlogHighlights from '@/components/home/BlogHighlights'
import EmailSignup from '@/components/home/EmailSignup'

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <HeroBackground>
          <ModuleCarousel />
          <MarketOverviewCards />
        </HeroBackground>
        <MarketsPreview />
        <NewsPreview />
        <BlogHighlights />
        <EmailSignup />
      </main>
      <Footer />
    </>
  )
}
