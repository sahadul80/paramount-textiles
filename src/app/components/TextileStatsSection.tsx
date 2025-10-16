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
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const stats: StatItem[] = [
    {
      id: 1,
      icon: FaUserTie,
      value: 350,
      title: "Trusted Clients",
    },
    {
      id: 2,
      icon: FaProjectDiagram,
      value: 215,
      title: "Finished Projects",
    },
    {
      id: 3,
      icon: FaIndustry,
      value: 25,
      title: "Years Of Experience",
    },
    {
      id: 4,
      icon: FaMapMarkerAlt,
      value: 45,
      title: "Visited Conference",
    }
  ]

  useEffect(() => {
    if (isInView) {
      setIsVisible(true)
    }
  }, [isInView])

  const Counter: React.FC<{ value: number; duration?: number }> = ({ 
    value, 
    duration = 2000 
  }) => {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)

    useEffect(() => {
      if (isVisible) {
        let start = 0
        const end = value
        const increment = end / (duration / 16)
        const timer = setInterval(() => {
          start += increment
          countRef.current = Math.min(Math.floor(start), end)
          setCount(countRef.current)
          if (countRef.current >= end) {
            clearInterval(timer)
          }
        }, 16)

        return () => clearInterval(timer)
      }
    }, [isVisible, value, duration])

    return <span>{count}+</span>
  }

  return (
    <section ref={sectionRef} className="stats-section">
      <div className="background-pattern" aria-hidden="true"></div>
      
      <div className="stats-container">
        {/* Heading Section */}
        <motion.div 
          className="stats-heading-container"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="stats-heading-spacer"></div>
          
          <div className="stats-heading-content">
            <motion.h2 className="stats-heading">
              The Textile, Product, And Apparel{" "}
              <span className="stats-heading-accent">Manufacturing</span> Industries.
            </motion.h2>
          </div>
          
          <div className="stats-heading-spacer"></div>
        </motion.div>

        {/* Statistics Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
            >
              <motion.div 
                className="stat-icon"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.5 }
                }}
              >
                <stat.icon />
              </motion.div>

              <div className="stat-value">
                <Counter value={stat.value} />
              </div>

              <h3 className="stat-title">{stat.title}</h3>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div 
          className="contact-section"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="contact-text">
            Don't hesitate, contact us for better help and services.{" "}
            <Link href="/contact-us" className="contact-link">
              Contact Us
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default TextileStatsSection