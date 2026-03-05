'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollTunnel } from './ScrollTunnel'
import * as THREE from 'three'
// @ts-ignore - lenis has no types
import Lenis from 'lenis'

const SCROLL_HEIGHT = 600

export function ScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBrand, setShowBrand] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  // @ts-ignore - lenis has no types
  const lenisRef = useRef(null)
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.5,
    })
    
    lenisRef.current = lenis
    
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      setScrollProgress(progress)
      
      // Brand reveal at 75%
      setShowBrand(progress > 0.72)
      
      // Nav reveal at 82%
      setShowNav(progress > 0.82)
      
      // Progress bar at 82%
      setShowProgress(progress > 0.82)
    })
    
    return () => {
      lenis.destroy()
    }
  }, [])
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = `${SCROLL_HEIGHT}vh`
    }
  }, [])
  
  return (
    <div 
      ref={containerRef}
      className="relative"
      style={{ height: `${SCROLL_HEIGHT}vh` }}
    >
      {/* 3D Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 60], fov: 60 }}
          gl={{ 
            antialias: true, 
            toneMapping: THREE.ACESFilmicToneMapping, 
            toneMappingExposure: 1.2 
          }}
        >
          <ScrollTunnel scrollProgress={scrollProgress} />
        </Canvas>
      </div>
      
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 w-full px-8 md:px-16 py-6 flex justify-between items-center z-50 transition-opacity duration-1000"
        style={{ 
          opacity: showNav ? 1 : 0,
          pointerEvents: showNav ? 'auto' : 'none'
        }}
      >
        <a href="#" className="text-[12px] tracking-[0.5em] text-white uppercase font-light">
          JWELLS
        </a>
        <div className="hidden md:flex gap-12">
          {['Home', 'Collections', 'Rings', 'Necklaces', 'Contact'].map((item) => (
            <a 
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="text-[8px] tracking-[0.3em] uppercase text-white/50 hover:text-[#D4AF37] transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </nav>
      
      {/* Brand Text */}
      <div 
        className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none transition-opacity duration-1500"
        style={{ opacity: showBrand ? 1 : 0 }}
      >
        <div className="text-center">
          <h1 
            className="text-[clamp(4rem,18vw,14rem)] font-light text-white tracking-[0.3em]"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              textShadow: '0 0 80px rgba(212,175,55,0.5), 0 0 160px rgba(212,175,55,0.25)',
            }}
          >
            JWELLS
          </h1>
          <p className="text-[10px] tracking-[1.5em] text-[#D4AF37] mt-4" style={{ marginLeft: '1.5em' }}>
            Crafted in Gold
          </p>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div 
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4 transition-opacity duration-500"
        style={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}
      >
        <div className="w-px h-16 bg-gradient-to-b from-[#D4AF37] to-transparent animate-pulse" />
        <span className="text-[8px] tracking-[0.6em] text-white/30 uppercase">
          Scroll to Explore
        </span>
      </div>
      
      {/* Progress Bar */}
      <div 
        className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 transition-opacity duration-500 hidden md:flex"
        style={{ opacity: showProgress ? 1 : 0 }}
      >
        <div className="w-[2px] h-32 bg-white/10 relative">
          <div 
            className="absolute top-0 left-0 w-full bg-[#D4AF37] transition-all duration-100"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <span className="text-[8px] tracking-[0.2em] text-white/30 uppercase">
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>
    </div>
  )
}

export default ScrollExperience
