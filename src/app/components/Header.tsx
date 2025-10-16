'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/pages/about' },
  { label: 'Design Studio', href: '/pages/design-studio' },
  { label: 'Contact', href: '/pages/contacts' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-foreground/25 backdrop-blur-2xl shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20" >
          {/* Logo */}
          <Link href="/" className="flex flex-row items-center viewbox-0">
            <Image
                src="/p1.png"
                alt="Paramount Textiles Logo"
                width={10}
                height={40}
                className="object-contain hover:scale-115 transition-transform duration-300"
            />
            <Image
                src="/p2.png"
                alt="Paramount Textiles Logo"
                width={10}
                height={40}
                className="object-contain hover:scale-115 transition-transform duration-300"
            />
            <Image
                src="/p3.png"
                alt="Paramount Textiles Logo"
                width={10}
                height={40}
                className="object-contain hover:scale-115 transition-transform duration-300"
            />
            <Image
                src="/p4.png"
                alt="Paramount Textiles Logo"
                width={10}
                height={40}
                className="object-contain hover:scale-115 transition-transform duration-300"
            />
            <div className='flex flex-col items-center ml-2 hover:scale-105 transition-transform duration-300 hover:cursor-pointer'>
                <h1 className='text-primary font-bold text-lg'>PARAMOUNT</h1>
                <h1 className='text-secondary font-semibold text-sm'>TEXTILES</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="p-2 text-primary hover:text-secondary font-medium transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t"
            >
              <div className="py-4 space-y-4">
                {navigation.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block p-2 text-primary hover:text-secondary font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}