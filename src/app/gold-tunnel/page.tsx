'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import GoldDustTunnel from '../../components/GoldDustTunnel'
import * as THREE from 'three'

export default function GoldTunnelPage() {
    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
            setScrollProgress(progress)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <main className="bg-[#020202] min-h-[500vh]">
            <div className="fixed inset-0 z-0">
                <Canvas
                    shadows
                    dpr={[1, 2]}
                    gl={{ 
                        antialias: true, 
                        toneMapping: THREE.ACESFilmicToneMapping, 
                        toneMappingExposure: 1.5 
                    }}
                >
                    <Suspense fallback={null}>
                        <GoldDustTunnel scrollProgress={scrollProgress} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 pointer-events-none">
                <section className="h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 
                            className="text-[clamp(2rem,8vw,6rem)] font-light text-white tracking-[0.4em] opacity-80"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            GOLDEN DUST
                        </h1>
                        <p className="text-[10px] tracking-[1em] text-[#D4AF37] mt-4 uppercase">
                            The Infinite Journey
                        </p>
                    </div>
                </section>

                <section className="h-screen" />
                
                <section className="h-screen flex items-center justify-center">
                    <p className="text-[12px] tracking-[0.5em] text-white/40 uppercase">
                        Experience the brilliance of pure gold
                    </p>
                </section>

                <section className="h-screen" />

                <section className="h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-px h-24 bg-gradient-to-b from-[#D4AF37] to-transparent" />
                        <p className="text-[9px] tracking-[0.8em] text-[#D4AF37]/60 uppercase">
                            Crafted for Perfection
                        </p>
                    </div>
                </section>
            </div>

            {/* Floating Back Button */}
            <div className="fixed bottom-10 left-10 z-50 pointer-events-auto">
                <a 
                    href="/" 
                    className="text-[10px] tracking-[0.4em] text-white/50 hover:text-[#D4AF37] transition-colors uppercase border border-white/10 px-6 py-3 rounded-full backdrop-blur-md"
                >
                    Back to Home
                </a>
            </div>
        </main>
    )
}
