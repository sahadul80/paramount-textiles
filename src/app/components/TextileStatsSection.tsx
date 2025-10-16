'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { 
  FaUserTie, 
  FaProjectDiagram, 
  FaIndustry, 
  FaMapMarkerAlt 
} from 'react-icons/fa'

interface StatItem {
  id: number
  icon: React.ComponentType<{ className?: string }>
  value: number
  title: string
}

const TextileStatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const stats: StatItem[] = [
    { id: 1, icon: FaUserTie, value: 350, title: 'Trusted Clients' },
    { id: 2, icon: FaProjectDiagram, value: 215, title: 'Finished Projects' },
    { id: 3, icon: FaIndustry, value: 25, title: 'Years Of Experience' },
    { id: 4, icon: FaMapMarkerAlt, value: 45, title: 'Visited Conferences' },
  ]

  useEffect(() => {
    if (isInView) setIsVisible(true)
  }, [isInView])

  const Counter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isVisible) return
      let start = 0
      const end = value
      const increment = end / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        setCount(prev => (start >= end ? end : Math.floor(start)))
        if (start >= end) clearInterval(timer)
      }, 16)
      return () => clearInterval(timer)
    }, [isVisible, value, duration])

    return <span>{count}+</span>
  }

  return (
    <section
  ref={sectionRef}
  className="textile-stats-section"
>
  <div className="textile-stats-section__pattern" aria-hidden="true" />
  
  <motion.h2 className="textile-stats-section__heading">
    The Textile, Product, And Apparel{' '}
    <span className="textile-stats-section__accent">Manufacturing</span> Industries
  </motion.h2>

  <div className="textile-stats-section__grid">
    {stats.map((stat, index) => (
      <motion.div key={stat.id} className="textile-stats-section__card">
        <motion.div className="textile-stats-section__icon-wrapper">
          <stat.icon className="textile-stats-section__icon" />
        </motion.div>
        <p className="textile-stats-section__value">
          <Counter value={stat.value} />
        </p>
        <p className="textile-stats-section__title">{stat.title}</p>
      </motion.div>
    ))}
  </div>

  <motion.div className="textile-stats-section__cta">
    <p>
      Don&apos;t hesitate, contact us for better help and services.{' '}
      <Link href="/pages/contacts" className="textile-stats-section__link">
        Contact Us
      </Link>
    </p>
  </motion.div>
</section>
  )
}

export default TextileStatsSection
