'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Award, Heart, ChevronRight } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Jewellery', href: '/rings' },
  { label: 'Contact', href: '/contact' },
]

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#D4AF37]/30"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0 
          }}
          animate={{ 
            y: [null, '-20%', '20%'],
            opacity: [0, 0.6, 0]
          }}
          transition={{ 
            duration: 8 + Math.random() * 8, 
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  )
}

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 md:px-16 py-6">
        <Link href="/" className="flex items-center gap-3 group">
          <ArrowLeft className="w-4 h-4 text-white/40 group-hover:text-[#D4AF37] transition-colors" />
          <span className="text-[10px] tracking-[0.6em] text-white/40 uppercase group-hover:text-white transition-colors">
            Back
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[9px] tracking-[0.6em] uppercase transition-all duration-300 hover:text-[#D4AF37]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden">
        <ParticleBackground />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
              <Sparkles className="w-4 h-4 text-[#D4AF37]/60" />
              <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl md:text-8xl font-light text-white mb-6 leading-[1.1]" 
                style={{ fontFamily: "'Playfair Display', serif" }}>
              The Art of <span className="text-gradient-gold italic">Timeless Beauty</span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <p className="text-lg md:text-xl text-white/40 font-light leading-relaxed max-w-2xl mx-auto">
              For over a century, JWELLS has been crafting extraordinary pieces that transcend mere adornment—becoming heirlooms of unparalleled elegance.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.4}>
            <motion.div 
              className="mt-16 w-32 h-32 mx-auto relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 border border-[#D4AF37]/10 rounded-full" />
              <div className="absolute inset-4 border border-dashed border-[#D4AF37]/20 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-sm rotate-45" />
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-32 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="aspect-[4/5] bg-gradient-to-br from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-sm overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border border-[#D4AF37]/20 rotate-45">
                      <div className="w-24 h-24 border border-[#D4AF37]/10 mt-2 ml-2" />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl" />
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] tracking-[0.8em] text-[#D4AF37]/60 uppercase mb-4 pl-[0.8em]">Our Story</p>
                  <h2 className="text-4xl md:text-5xl font-light text-white mb-6" 
                      style={{ fontFamily: "'Playfair Display', serif" }}>
                    A Legacy of <span className="text-gradient-gold">Excellence</span>
                  </h2>
                </div>
                
                <p className="text-white/50 leading-loose">
                  Founded in Geneva in 1924, JWELLS began as a small atelier dedicated to the pursuit of jewellery perfection. Our founder, Elias Wells, believed that every piece of jewellery should tell a story—of love, achievement, and the moments that define a life.
                </p>
                
                <p className="text-white/50 leading-loose">
                  Today, JWELLS continues this tradition, blending time-honored techniques with contemporary vision. Each creation is a testament to our unwavering commitment to quality, artistry, and the belief that true luxury lies in the details.
                </p>
                
                <div className="flex gap-8 pt-4">
                  <div>
                    <div className="text-4xl font-light text-gradient-gold mb-1" 
                         style={{ fontFamily: "'Playfair Display', serif" }}>100+</div>
                    <div className="text-[8px] tracking-[0.4em] text-white/30 uppercase">Years of Heritage</div>
                  </div>
                  <div>
                    <div className="text-4xl font-light text-gradient-gold mb-1" 
                         style={{ fontFamily: "'Playfair Display', serif" }}>500+</div>
                    <div className="text-[8px] tracking-[0.4em] text-white/30 uppercase">Master Artisans</div>
                  </div>
                  <div>
                    <div className="text-4xl font-light text-gradient-gold mb-1" 
                         style={{ fontFamily: "'Playfair Display', serif" }}>24K</div>
                    <div className="text-[8px] tracking-[0.4em] text-white/30 uppercase">Pure Gold</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="relative py-32 px-8 md:px-16 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <p className="text-[10px] tracking-[0.8em] text-[#D4AF37]/60 uppercase mb-4 pl-[0.8em]">The Craft</p>
              <h2 className="text-4xl md:text-6xl font-light text-white" 
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Meticulous <span className="text-gradient-gold italic">Craftsmanship</span>
              </h2>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Uncompromising Quality',
                description: 'Every piece undergoes 47 quality inspections. We source only the finest 24-karat gold and conflict-free gemstones.',
              },
              {
                icon: Heart,
                title: 'Handcrafted Excellence',
                description: 'Each creation is hand-finished by master artisans in our Geneva atelier, some taking over 400 hours to complete.',
              },
              {
                icon: Sparkles,
                title: 'Timeless Design',
                description: 'Our designs transcend trends, creating pieces that remain as relevant and beautiful generations from now.',
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.15}>
                <div className="group p-8 border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-500">
                  <item.icon className="w-8 h-8 text-[#D4AF37]/40 mb-6 group-hover:text-[#D4AF37] transition-colors" />
                  <h3 className="text-xl font-light text-white mb-4" 
                      style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative py-32 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <p className="text-[10px] tracking-[0.8em] text-[#D4AF37]/60 uppercase mb-4 pl-[0.8em]">The Process</p>
              <h2 className="text-4xl md:text-5xl font-light text-white" 
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                From Concept to <span className="text-gradient-gold">Masterpiece</span>
              </h2>
            </div>
          </AnimatedSection>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D4AF37]/30 via-[#D4AF37]/10 to-transparent" />
            
            {[
              { step: '01', title: 'Design Vision', desc: 'Every piece begins with a sketch, a dream, a vision of something extraordinary.' },
              { step: '02', title: 'Selection', desc: 'We hand-select the finest gemstones and purest gold, rejecting 97% of what we see.' },
              { step: '03', title: 'Modeling', desc: 'Using ancient techniques and modern precision, we create a wax model of the design.' },
              { step: '04', title: 'Casting', desc: 'The lost-wax casting process transforms the model into solid gold.' },
              { step: '05', title: 'Refinement', desc: 'Master artisans spend hundreds of hours hand-finishing every surface.' },
              { step: '06', title: 'Revelation', desc: 'The final piece emerges—a creation that will be treasured forever.' },
            ].map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.1}>
                <div className="relative pl-20 pb-16 last:pb-0">
                  <div className="absolute left-5 w-6 h-6 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                  </div>
                  <p className="text-[10px] tracking-[0.3em] text-[#D4AF37]/50 uppercase mb-2">{item.step}</p>
                  <h3 className="text-2xl font-light text-white mb-3" 
                      style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed max-w-md">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-8 md:px-16 bg-[#080808]">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6" 
                style={{ fontFamily: "'Playfair Display', serif" }}>
              Experience JWELLS
            </h2>
            <p className="text-white/40 mb-10 max-w-xl mx-auto">
              Visit our Geneva atelier or schedule a private consultation to discover pieces crafted for eternity.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-3 text-[10px] tracking-[0.6em] uppercase text-[#D4AF37] border border-[#D4AF37]/30 px-10 py-5 hover:bg-[#D4AF37]/10 transition-all duration-500"
            >
              Contact Us
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border border-[#D4AF37]/30 rotate-45">
              <div className="w-5 h-5 border border-[#D4AF37]/15 mt-1 ml-1" />
            </div>
            <span className="text-[10px] tracking-[0.8em] text-white/40 uppercase">JWELLS</span>
          </div>
          <p className="text-[8px] tracking-[0.2em] text-white/20 uppercase">
            © {new Date().getFullYear()} JWELLS S.A. Geneva · All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  )
}
