'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FaIndustry, 
  FaUserTie, 
  FaWarehouse, 
  FaTshirt,
  FaArrowRight
} from 'react-icons/fa'

const AboutSection = () => {
  const features = [
    {
      icon: FaIndustry,
      title: "Company Overview",
      description: "We bring a revolutionary change in the Textile industry through products!",
      link: "/pages/about",
      color: "feature-blue"
    },
    {
      icon: FaUserTie,
      title: "Production Capability",
      description: "We aim to be more than just legally compliant.",
      link: "/pages/about",
      color: "feature-green"
    },
    {
      icon: FaWarehouse,
      title: "Company History",
      description: "One of the largest & most reputed textile groups in India & globally.",
      link: "/pages/about",
      color: "feature-purple"
    },
    {
      icon: FaTshirt,
      title: "Fabric Designs",
      description: "Gold trophy 5 years in a row for being the largest exporter.",
      link: "/pages/about",
      color: "feature-orange"
    }
  ]

  // Motion variants
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    }
  }

  const iconVariants = {
    normal: {
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      rotate: 360,
      scale: 1.2,
      transition: {
        rotate: {
          duration: 0.8,
          ease: "easeInOut"
        },
        scale: {
          duration: 0.3
        }
      }
    }
  }

  const cardVariants = {
    normal: {
      scale: 1,
      y: 0
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="about-section relative overflow-hidden bg-background p-4 min-h-screen flex items-center">
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="flex flex-col sm:flex-row gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left Column */}
          <motion.div 
            className="w-full h-full sm:w-5/12"
          >
            <motion.div 
              className="bg-background backdrop-blur-sm rounded-2xl p-4 shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h2 
                className="text-3xl lg:text-4xl font-bold text-Primary m-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Ultimate Quality <span className="text-secondary">Textiles</span>
              </motion.h2>
              
              <motion.div 
                className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              />
              
              <motion.p 
                className="text-secondary text-lg leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                We are your reliable and experienced textile partner around the world.
              </motion.p>

              {/* Video Section */}
              <motion.div 
                className="relative rounded-xl overflow-hidden shadow-xl mb-4"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <video 
                  src="/videos/design-studio.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full rounded-xl"
                  aria-label="Paramout Textile Design Studio Video"
                />
                <div className="absolute inset-0 bg-background hover:bg-foreground transition-colors duration-300" />
              </motion.div>

              <motion.p 
                className="text-center text-primary font-semibold text-lg tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                PARAMOUT TEXTILE - DESIGN STUDIO
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Right Column: Feature Cards */}
          <motion.div 
            className="w-full h-full sm:w-7/12 flex items-center"
            variants={containerVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group relative"
                  whileHover="hover"
                  initial="normal"
                >
                  <motion.div
                    className={`feature-card rounded-2xl p-6 shadow-lg border border-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col${
                      feature.color === 'feature-blue' ? 'hover:border-blue-200' :
                      feature.color === 'feature-green' ? 'hover:border-green-200' :
                      feature.color === 'feature-purple' ? 'hover:border-purple-200' :
                      'hover:border-orange-200'
                    }`}
                  >
                    {/* Title */}
                        <p className="feature-title text-xl font-bold text-gray-900 flex-1 mt-1">
                            {feature.title}
                        </p>
                    <div className='flex flex-row justofy-between items-center gap-4'>
                        {/* Icon Container */}
                        <motion.div
                            className={`flex-shrink-0 w-20 h-20 sm:w-30 sm:h-30 rounded-xl flex items-center justify-center  ${
                            feature.color === 'feature-blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                            feature.color === 'feature-green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                            feature.color === 'feature-purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                            'bg-gradient-to-br from-orange-500 to-orange-600'
                            } shadow-lg`}
                        >
                            <feature.icon className="w-10 h-10 sm:w-15 sm:h-15" />
                        </motion.div>
                        <div className="flex flex-col items-start gap-2">
                            {/* Description */}
                            <motion.p 
                                className="feature-description text-gray-600 leading-relaxed mb-4 flex-1"
                                whileHover={{ y: -2 }}
                            >
                                {feature.description}
                            </motion.p>
                        </div>
                    </div>
                    {/* Read More Button - Hidden by default, visible on hover */}
                    <motion.div
                      className="flex justify-end"
                    >
                      <motion.div>
                        <Link 
                          href={feature.link} 
                          className="feature-link inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 group/link"
                        >
                          <span>Read More</span>
                          <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="group-hover/link:translate-x-1 transition-transform duration-300"
                          >
                            <FaArrowRight className="link-icon w-4 h-4" />
                          </motion.span>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(0, 20px) scale(0.9);
          }
          75% {
            transform: translate(-20px, -10px) scale(1.05);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .feature-card {
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          transition: left 0.5s;
        }

        .feature-card:hover::before {
          left: 100%;
        }
      `}</style>
    </section>
  )
}

export default AboutSection