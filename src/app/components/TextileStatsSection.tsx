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
      className="relative flex flex-col items-center justify-center max-h-screen px-6 py-16 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-[url('/pattern-grid.svg')] bg-cover opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Heading */}
      <motion.h2
        className="z-10 mb-10 text-2xl md:text-4xl font-bold text-center text-gray-800 max-w-2xl leading-snug"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        The Textile, Product, And Apparel{' '}
        <span className="text-indigo-600">Manufacturing</span> Industries
      </motion.h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 z-10 w-full max-w-5xl">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            className="flex flex-col items-center justify-center p-6 bg-white/80 rounded-2xl shadow-md backdrop-blur-md hover:shadow-xl transition"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <motion.div
              className="flex items-center justify-center w-14 h-14 mb-4 text-white bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-lg"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <stat.icon className="text-2xl" />
            </motion.div>

            <p className="text-3xl font-extrabold text-gray-900">
              <Counter value={stat.value} />
            </p>
            <p className="mt-2 text-sm md:text-base text-gray-600 text-center">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Contact CTA */}
      <motion.div
        className="z-10 mt-10 text-center text-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className="text-sm md:text-base">
          Don&apos;t hesitate, contact us for better help and services.{' '}
          <Link href="/pages/contacts" className="text-indigo-600 font-semibold hover:underline">
            Contact Us
          </Link>
        </p>
      </motion.div>
    </section>
  )
}

export default TextileStatsSection
