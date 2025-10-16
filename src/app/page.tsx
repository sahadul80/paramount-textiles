'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import ParamountLoader from './components/Loader'

// Types for hero data
interface HeroData {
  backgroundImages: string[]
  backgroundVideos: string[]
  slides: Array<{
    title: string
    subtitle: string
    description?: string
    buttons: Array<{
      text: string
      link: string
      primary: boolean
    }>
  }>
  autoPlayInterval: number
  showScrollIndicator: boolean
}

// Dynamically import components with lazy loading and proper loading states
const HeroBanner = dynamic(() => import('./components/HeroBanner'), {
  loading: () => (
    <div className="hero-placeholder" style={{ height: '100vh' }}>
      <div className="hero-placeholder__inner">
        <ParamountLoader />
      </div>
    </div>
  ),
  ssr: false
})

const AboutSection = dynamic(() => import('./components/AboutSection'), {
  loading: () => <SectionLoader height="80vh" />,
  ssr: true
})

const TextileBanner = dynamic(() => import('./components/TextileBanner'), {
  loading: () => <SectionLoader height="20vh" />,
  ssr: true
})

const SupimaSection = dynamic(() => import('./components/SupimaSection'), {
  loading: () => <SectionLoader height="100vh" />,
  ssr: true
})

const TextileStatsSection = dynamic(() => import('./components/TextileStatsSection'), {
  loading: () => <SectionLoader height="60vh" />,
  ssr: true
})

const QualitySection = dynamic(() => import('./components/QualitySection'), {
  loading: () => <SectionLoader height="80vh" />,
  ssr: true
})

const ContactSection = dynamic(() => import('./components/ContactSection'), {
  loading: () => <SectionLoader height="70vh" />,
  ssr: true
})

// Loader component for sections
function SectionLoader({ height = "50vh" }: { height?: string }) {
  return (
    <div 
      className="w-full flex items-center justify-center bg-background"
      style={{ height }}
    >
      <div className="text-center">
        <ParamountLoader />
      </div>
    </div>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [visibleSections, setVisibleSections] = useState({
    about: false,
    textileBanner: false,
    supima: false,
    stats: false,
    quality: false,
    contact: false
  })

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Intersection Observer for lazy loading sections
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    const sectionConfigs = [
      { id: 'about-section', key: 'about' as keyof typeof visibleSections },
      { id: 'textile-banner', key: 'textileBanner' as keyof typeof visibleSections },
      { id: 'supima-section', key: 'supima' as keyof typeof visibleSections },
      { id: 'stats-section', key: 'stats' as keyof typeof visibleSections },
      { id: 'quality-section', key: 'quality' as keyof typeof visibleSections },
      { id: 'contact-section', key: 'contact' as keyof typeof visibleSections }
    ]

    sectionConfigs.forEach(({ id, key }) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({
              ...prev,
              [key]: true
            }))
            observer.disconnect()
          }
        },
        {
          rootMargin: '50px', // Load 50px before section becomes visible
          threshold: 0.1
        }
      )

      const section = sectionRefs.current[id]
      if (section) {
        observer.observe(section)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [])

  // Fetch hero data
  useEffect(() => {
    const ac = new AbortController()
    let mounted = true

    async function fetchHeroData() {
      try {
        const resp = await fetch('/hero-data.json', { 
          signal: ac.signal, 
          cache: 'no-store' 
        })
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
            { 
              title: 'Paramount Textile Bangladesh', 
              subtitle: 'Worlds No.1 Fabric', 
              buttons: [] 
            },
            {
              title: 'The Possibilities Are Endless',
              subtitle: 'WELCOME TO Paramount Textile Bangladesh',
              description: 'Since more than 40 years, Paramount Textile Bangladesh is operating in the textile market manufacture and trader. As years go by, the range of produced.',
              buttons: [
                { text: 'More Details', link: '/pages/about', primary: true },
                { text: 'Get Quote', link: '/pages/contact', primary: false }
              ]
            },
            {
              title: 'Wear Your Best Moments',
              subtitle: '-YOU CAN TRUST US-',
              description: 'Since more than 40 years, Luthai India is operating in the textile market manufacture and trader. As years go by, the range of produced.',
              buttons: [{ text: 'More Details', link: '/pages/about', primary: true }]
            }
          ],
          autoPlayInterval: 5000,
          showScrollIndicator: true
        })
      } finally {
        // Small delay for UX polish
        setTimeout(() => {
          if (mounted) setIsLoading(false)
        }, 100)
      }
    }

    fetchHeroData()

    return () => {
      mounted = false
      ac.abort()
    }
  }, [])

  // Set ref for each section
  const setSectionRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el
  }

  return (
    <div className="page-root">
      <main className="page-main relative overflow-hidden">

        {/* Hero Banner - Load immediately */}
        <section className="relative z-10">
          {heroData ? (
            <HeroBanner data={heroData} />
          ) : (
            <div className="hero-placeholder" style={{ height: '100vh' }}>
              <div className="hero-placeholder__inner">
                <ParamountLoader />
              </div>
            </div>
          )}
        </section>

        {/* About Section */}
        <section 
          ref={setSectionRef('about-section')}
          id="about-section" 
          className="relative z-20 bg-white mobile-section"
        >
          {visibleSections.about ? (
            <AboutSection />
          ) : (
            <SectionLoader height="80vh" />
          )}
        </section>

        {/* Textile Banner */}
        <section 
          ref={setSectionRef('textile-banner')}
          id="textile-banner" 
          className="relative z-30 bg-background mobile-section"
        >
          {visibleSections.textileBanner ? (
            <div className="w-full h-auto min-h-[15vh] sm:min-h-[20vh] flex items-center justify-center bg-background">
              <TextileBanner />
            </div>
          ) : (
            <SectionLoader height="20vh" />
          )}
        </section>

        {/* Supima Section */}
        <section 
          ref={setSectionRef('supima-section')}
          id="supima-section" 
          className="relative z-40 bg-white mobile-section"
        >
          {visibleSections.supima ? (
            <SupimaSection />
          ) : (
            <SectionLoader height="100vh" />
          )}
        </section>

        {/* Stats Section */}
        <section 
          ref={setSectionRef('stats-section')}
          id="stats-section" 
          className="relative z-50 bg-gray-900 mobile-section"
        >
          {visibleSections.stats ? (
            <TextileStatsSection />
          ) : (
            <SectionLoader height="60vh" />
          )}
        </section>

        {/* Quality Section */}
        <section 
          ref={setSectionRef('quality-section')}
          id="quality-section" 
          className="relative z-60 bg-white mobile-section"
        >
          {visibleSections.quality ? (
            <QualitySection />
          ) : (
            <SectionLoader height="80vh" />
          )}
        </section>

        {/* Contact Section */}
        <section 
          ref={setSectionRef('contact-section')}
          id="contact-section" 
          className="relative z-70 bg-gray-50 mobile-section"
        >
          {visibleSections.contact ? (
            <ContactSection />
          ) : (
            <SectionLoader height="70vh" />
          )}
        </section>
      </main>

      {/* Mobile optimization styles */}
      <style jsx global>{`
        /* Mobile overlap prevention */
        @media (max-width: 768px) {
          .mobile-section {
            position: relative;
            overflow: hidden;
            transform: translateZ(0);
            will-change: transform;
          }
          
          /* Ensure proper stacking and spacing */
          .page-main > section {
            margin-bottom: 0;
            border-bottom: 1px solid transparent;
          }
          
          /* Prevent horizontal overflow */
          .page-root {
            overflow-x: hidden;
            width: 100%;
          }
          
          /* Fix for any absolute positioned elements */
          .page-main .absolute {
            z-index: 1;
          }
        }
        
        /* Smooth scrolling for better UX */
        @media (prefers-reduced-motion: no-preference) {
          html {
            scroll-behavior: smooth;
          }
        }
        
        /* Loading states */
        .page-root {
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
        }
        
        /* Section entrance animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .section-loaded {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}