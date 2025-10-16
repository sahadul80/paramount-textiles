'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  CheckBadgeIcon,
  ShieldCheckIcon,
  TrophyIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

const qualityMetrics = [
  {
    icon: CheckBadgeIcon,
    value: 'ISO 9001',
    label: 'Quality Certified'
  },
  {
    icon: ShieldCheckIcon,
    value: '100%',
    label: 'Quality Assurance'
  },
  {
    icon: TrophyIcon,
    value: 'Award',
    label: 'Winning Quality'
  },
  {
    icon: GlobeAltIcon,
    value: '50+',
    label: 'Countries Served'
  }
]

export default function QualitySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  }

  return (
    
    <section ref={ref} className="quality-section">
    <div className="quality-section__container">
        <motion.div variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
        <motion.div variants={itemVariants} className="quality-section__header">
            <h2 className="quality-section__title">Uncompromising Quality</h2>
            <p className="quality-section__description">
            Our commitment to excellence ensures every fabric meets the highest standards
            </p>
            <div className="quality-section__divider"></div>
        </motion.div>

        <motion.div variants={itemVariants} className="quality-section__metrics">
            {qualityMetrics.map((metric, index) => (
            <div key={index} className="quality-section__metric">
                <div className="quality-section__metric-icon">
                <metric.icon className="quality-section__metric-icon-svg" />
                </div>
                <div className="quality-section__metric-value">{metric.value}</div>
                <div className="quality-section__metric-label">{metric.label}</div>
            </div>
            ))}
        </motion.div>

        <div className="quality-section__process">
            <motion.div variants={itemVariants} className="quality-section__process-step">
            <div className="quality-section__step-number">01</div>
            <h3 className="quality-section__step-title">Raw Material Selection</h3>
            <p className="quality-section__step-description">
                We source only the finest raw materials from trusted suppliers worldwide
            </p>
            </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-[#a8761a]">02</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Precision Manufacturing</h3>
                <p className="text-gray-600">
                    Advanced manufacturing processes ensure consistent quality and perfection
                </p>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-[#a8761a]">03</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Control</h3>
                <p className="text-gray-600">
                    Rigorous testing and inspection at every stage guarantee exceptional quality
                </p>
                </motion.div>
            
        </div>
        </motion.div>
    </div>
    </section>
  )
}
