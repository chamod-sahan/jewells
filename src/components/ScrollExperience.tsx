'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollTunnel } from './ScrollTunnel'
import * as THREE from 'three'
// @ts-ignore - lenis has no types
import Lenis from 'lenis'

const SCROLL_HEIGHT = 500

export function ScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showText, setShowText] = useState(false)
  // @ts-ignore - lenis has no types
  const lenisRef = useRef(null)
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })
    
    lenisRef.current = lenis
    
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      setScrollProgress(progress)
      setShowText(progress > 0.85)
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
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 50], fov: 60 }}
          gl={{ 
            antialias: true, 
            toneMapping: THREE.ACESFilmicToneMapping, 
            toneMappingExposure: 1.2 
          }}
        >
          <ScrollTunnel scrollProgress={scrollProgress} />
        </Canvas>
      </div>
      
      <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
        <div 
          className="text-center transition-all duration-1000"
          style={{
            opacity: showText ? 1 : 0,
            transform: showText ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          }}
        >
          <h1 
            className="text-[clamp(3rem,12vw,10rem)] font-light text-white tracking-[0.4em] pl-[0.4em]"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              textShadow: '0 0 60px rgba(212,175,55,0.6), 0 0 120px rgba(212,175,55,0.3)',
            }}
          >
            JWELLS
          </h1>
          <p 
            className="text-[10px] tracking-[1.2em] text-[#D4AF37] mt-6 pl-[1.2em]"
            style={{ opacity: showText ? 1 : 0 }}
          >
            Timeless Elegance
          </p>
        </div>
      </div>
      
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-px h-16 bg-gradient-to-b from-[#D4AF37]/60 to-transparent"
            style={{ opacity: 1 - scrollProgress }}
          />
          <span 
            className="text-[8px] tracking-[0.6em] text-white/40 uppercase"
            style={{ opacity: 1 - scrollProgress * 2 }}
          >
            Scroll to Explore
          </span>
        </div>
      </div>
      
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <div className="flex flex-col items-center gap-2">
          <div 
            className="w-[1px] h-40 bg-white/10 relative"
          >
            <div 
              className="absolute top-0 left-0 w-full bg-[#D4AF37] transition-all duration-100"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
          <span className="text-[7px] tracking-[0.2em] text-white/30 uppercase">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default ScrollExperience
