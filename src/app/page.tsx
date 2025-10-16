'use client'

import dynamic from 'next/dynamic'
import HeroBanner, { HeroData } from './components/HeroBanner'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import QualitySection from './components/QualitySection'
import ParamountLoader from './components/Loader'
import SupimaSection from './components/SupimaSection'
import TextileStatsSection from './components/TextileStatsSection'
import TextileBanner from './components/TextileBanner'

// Dynamically import the 3D model (client-only)
const SupimaModel = dynamic(() => import('./components/SupimaModel'), {
  ssr: false
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [heroData, setHeroData] = useState<HeroData | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true

    async function fetchHeroData() {
      try {
        const resp = await fetch('/hero-data.json', { signal: ac.signal, cache: 'no-store' })
        if (!resp.ok) throw new Error('Failed to fetch hero-data.json')
        const json = await resp.json()
        if (!mounted) return

        // Minimal validation: ensure keys exist
        const normalized: HeroData = {
          backgroundImages: Array.isArray(json.backgroundImages) ? json.backgroundImages : [],
          backgroundVideos: Array.isArray(json.backgroundVideos) ? json.backgroundVideos : [],
          slides: Array.isArray(json.slides) ? json.slides : [],
          autoPlayInterval: typeof json.autoPlayInterval === 'number' ? json.autoPlayInterval : 5000,
          showScrollIndicator: typeof json.showScrollIndicator === 'boolean' ? json.showScrollIndicator : true
        }

        setHeroData(normalized)
      } catch (err) {
        // Fallback data when fetch fails
        console.warn('Could not load /hero-data.json — using fallback', err)
        if (!mounted) return
        setHeroData({
          backgroundImages: ['/images/default-1.jpg', '/images/default-2.jpg', '/images/default-3.jpg'],
          backgroundVideos: [],
          slides: [
            { title: 'Paramount Textile Bangladesh', subtitle: 'Worlds No.1 Fabric', buttons: [] },
            {
              title: 'The Possibilities Are Endless',
              subtitle: 'WELCOME TO Paramount Textile Bangladesh',
              description:
                'Since more than 40 years, Paramount Textile Bangladesh is operating in the textile market manufacture and trader. As years go by, the range of produced.',
              buttons: [
                { text: 'More Details', link: '/pages/about', primary: true },
                { text: 'Get Quote', link: '/pages/contact', primary: false }
              ]
            },
            {
              title: 'Wear Your Best Moments',
              subtitle: '-YOU CAN TRUST US-',
              description:
                'Since more than 40 years, Luthai India is operating in the textile market manufacture and trader. As years go by, the range of produced.',
              buttons: [{ text: 'More Details', link: '/pages/about', primary: true }]
            }
          ],
          autoPlayInterval: 5000,
          showScrollIndicator: true
        })
      } finally {
        // small delay for UX polish (optional)
        setTimeout(() => {
          if (mounted) setIsLoading(false)
        }, 80)
      }
    }

    fetchHeroData()

    return () => {
      mounted = false
      ac.abort()
    }
  }, [])

  return (
    <div className="page-root">
      <main className="page-main">
        <Header />

        {/* Hero Banner */}
        {heroData ? (
          <HeroBanner data={heroData} />
        ) : (
          // lightweight placeholder while we haven't loaded data yet
          <div className="hero-placeholder" style={{ height: '100vh' }}>
            <div className="hero-placeholder__inner">
              <ParamountLoader/>
            </div>
          </div>
        )}

        <AboutSection />
        <div className='w-auto h-auto min-h-[15vh] sm:min-h-[20vh] flex items-center justify-center bg-background z-50'>
            <TextileBanner/>
        </div>
        <SupimaSection/>
        <TextileStatsSection/>
        <QualitySection />
        <ContactSection />
      </main>
    </div>
  )
}
