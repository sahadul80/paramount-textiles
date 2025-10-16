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
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Uncompromising Quality
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence ensures every fabric meets the highest standards
            </p>
            <div className="w-20 h-1 bg-[#a8761a] mx-auto mt-4"></div>
          </motion.div>

          {/* Quality Metrics */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="bg-[#a8761a] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <metric.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </div>
                <div className="text-gray-600">
                  {metric.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Quality Process */}
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#a8761a]">01</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Raw Material Selection</h3>
              <p className="text-gray-600">
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