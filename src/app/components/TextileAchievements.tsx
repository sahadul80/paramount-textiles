'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  FiAward, 
  FiUsers, 
  FiTrendingUp, 
  FiClock, 
  FiStar, 
  FiCheckCircle,
  FiGlobe,
  FiHeart,
  FiZap
} from 'react-icons/fi';

interface AchievementStat {
  id: number;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  duration?: number;
}

interface AchievementCardProps {
  stat: AchievementStat;
  isInView: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ stat, isInView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = stat.duration || 2000;
      const steps = 60;
      const increment = stat.value / steps;
      const stepTime = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCount(stat.value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, stat.value, stat.duration]);

  return (
    <motion.div
      className={`relative p-6 rounded-2xl backdrop-blur-sm border ${stat.color} transform-gpu`}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      whileHover={{ 
        y: -10,
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
    >
      {/* 3D Effect Layers */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-50" />
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30 blur-sm" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${stat.color.replace('border', 'bg').replace('text', 'bg')} bg-opacity-20`}>
            {stat.icon}
          </div>
          <motion.div
            className="text-2xl font-bold opacity-20"
            initial={{ rotateX: 0 }}
            whileHover={{ rotateX: 15 }}
            transition={{ duration: 0.3 }}
          >
            {stat.id}
          </motion.div>
        </div>
        
        <motion.div 
          className="text-3xl lg:text-4xl font-bold mb-2"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stat.prefix}{count}{stat.suffix}
        </motion.div>
        
        <motion.p 
          className="text-sm opacity-80 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {stat.label}
        </motion.p>
      </div>
    </motion.div>
  );
};

const TextileAchievements3D: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<'design' | 'clients' | 'growth'>('design');

  const achievementStats: AchievementStat[] = [
    {
      id: 1,
      value: 1500,
      suffix: '+',
      label: 'Textile Designs Created',
      icon: <FiAward className="w-6 h-6" />,
      color: 'border-blue-500/20 text-blue-400 bg-blue-500/10',
      duration: 2500
    },
    {
      id: 2,
      value: 250,
      suffix: '+',
      label: 'Happy Clients Worldwide',
      icon: <FiUsers className="w-6 h-6" />,
      color: 'border-green-500/20 text-green-400 bg-green-500/10',
      duration: 2200
    },
    {
      id: 3,
      value: 98,
      suffix: '%',
      label: 'Client Satisfaction Rate',
      icon: <FiStar className="w-6 h-6" />,
      color: 'border-yellow-500/20 text-yellow-400 bg-yellow-500/10',
      duration: 1800
    },
    {
      id: 4,
      value: 5,
      suffix: '+',
      label: 'Years of Excellence',
      icon: <FiClock className="w-6 h-6" />,
      color: 'border-purple-500/20 text-purple-400 bg-purple-500/10',
      duration: 1500
    },
    {
      id: 5,
      value: 500,
      suffix: 'K+',
      label: 'Digital Patterns Sold',
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: 'border-pink-500/20 text-pink-400 bg-pink-500/10',
      duration: 3000
    },
    {
      id: 6,
      value: 50,
      suffix: '+',
      label: 'Countries Served',
      icon: <FiGlobe className="w-6 h-6" />,
      color: 'border-indigo-500/20 text-indigo-400 bg-indigo-500/10',
      duration: 2000
    },
    {
      id: 7,
      value: 99,
      suffix: '%',
      label: 'On-Time Delivery',
      icon: <FiCheckCircle className="w-6 h-6" />,
      color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10',
      duration: 1700
    },
    {
      id: 8,
      value: 24,
      suffix: '/7',
      label: 'Support Availability',
      icon: <FiZap className="w-6 h-6" />,
      color: 'border-orange-500/20 text-orange-400 bg-orange-500/10',
      duration: 1600
    }
  ];

  const categoryStats = {
    design: achievementStats.slice(0, 4),
    clients: achievementStats.slice(2, 6),
    growth: achievementStats.slice(4, 8)
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <FiAward className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white/80">Industry Leader Since 2018</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Textile Design
            <motion.span 
              className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Excellence
            </motion.span>
          </h1>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Transforming the fabric industry with innovative designs, cutting-edge technology, 
            and unparalleled creativity that sets new standards in textile manufacturing.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            {[
              { key: 'design' as const, label: 'Design Excellence', icon: FiAward },
              { key: 'clients' as const, label: 'Client Success', icon: FiUsers },
              { key: 'growth' as const, label: 'Growth Metrics', icon: FiTrendingUp }
            ].map((category) => (
              <motion.button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCategory === category.key
                    ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20'
                    : 'text-white/60 hover:text-white/80'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
                {activeCategory === category.key && (
                  <motion.div
                    className="absolute inset-0 border border-blue-400/50 rounded-xl"
                    layoutId="activeCategory"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 3D Stats Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          <AnimatePresence mode="wait">
            {categoryStats[activeCategory].map((stat) => (
              <AchievementCard
                key={stat.id}
                stat={stat}
                isInView={isInView}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 3D Progress Rings */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { label: 'Design Innovation', value: 95, color: 'from-blue-500 to-cyan-500' },
            { label: 'Client Satisfaction', value: 98, color: 'from-green-500 to-emerald-500' },
            { label: 'Project Efficiency', value: 92, color: 'from-purple-500 to-pink-500' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-white/10"
                  />
                  {/* Progress Circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * item.value) / 100}
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * item.value) / 100 }}
                    transition={{ duration: 2, delay: 1 + index * 0.3, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" className={`text-${item.color.split(' ')[0].replace('from-', '')}`} />
                      <stop offset="100%" className={`text-${item.color.split(' ')[1].replace('to-', '')}`} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className="text-2xl font-bold text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.5 + index * 0.3 }}
                  >
                    {item.value}%
                  </motion.span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.label}</h3>
              <p className="text-white/60 text-sm">Industry Leading Performance</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white text-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <FiHeart className="w-5 h-5" />
              Join Our Success Story
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          <p className="text-white/40 text-sm mt-4">
            Trusted by leading fashion brands and textile manufacturers worldwide
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TextileAchievements3D;