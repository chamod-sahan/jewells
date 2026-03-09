'use client'

import React, { useState, useEffect, useRef } from 'react'
import { CinematicExperience } from '../components/CinematicExperience'
import { SmoothScroll } from '../components/SmoothScroll'
import { Navbar, HeroSection, AboutSection, CollectionSection, ContactSection } from '../components/Sections'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
    const [scrollProgress, setScrollProgress] = useState(0)
    const [showBrand, setShowBrand] = useState(true)
    const [showNav, setShowNav] = useState(false)
    const mainRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // ScrollTrigger setup
        const ctx = gsap.context(() => {
            // Create a timeline to track scroll progress for the 3D transition
            ScrollTrigger.create({
                trigger: mainRef.current,
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: (self) => {
                    // Accelerate ring formation so it's complete before the Hero section ends
                    const ringProgress = Math.min(1, self.progress * 2.8)
                    setScrollProgress(ringProgress)

                    // Show brand at the start (progress < 0.1) and keep it until middle scroll
                    // Show brand ONLY at the absolute start. Disappears immediately on scroll.
                    if (self.progress <= 0.01 && !showBrand) setShowBrand(true)
                    if (self.progress > 0.01 && showBrand) setShowBrand(false)

                    // Show nav as soon as ring is fully formed
                    if (ringProgress > 0.95 && !showNav) setShowNav(true)
                    if (ringProgress < 0.95 && showNav) setShowNav(false)
                },
            })
        }, mainRef)

        return () => ctx.revert()
    }, [showBrand, showNav])

    return (
        <SmoothScroll>
            <main ref={mainRef} className="relative bg-[#050505]">
                {/* Fixed 3D Layer */}
                <CinematicExperience scrollProgress={scrollProgress} />

                {/* UI Overlay */}
                <Navbar show={showNav} />

                {/* Scrollable Content */}
                <div className="relative z-10">
                    {/* Section 1: Hero / Ring Creation (Text stays sticky as background tunnel moves) */}
                    <section className="h-[300vh] relative">
                        <div className="sticky top-0 h-screen flex items-center justify-center">
                            <HeroSection showBrand={showBrand} />
                        </div>
                    </section>
                    {/* Section 2: About (Storytelling) */}

                    {/* Section 2: About (Storytelling) */}
                    <section className="min-h-screen">
                        <AboutSection />
                    </section>

                    {/* Section 3: Collection (Gallery) */}
                    <section className="min-h-screen">
                        <CollectionSection />
                    </section>

                    {/* Section 4: Contact (Inquiry) */}
                    <section className="min-h-screen">
                        <ContactSection />
                    </section>

                    {/* Footer */}
                    <footer className="py-20 px-10 md:px-32 border-t border-white/5 flex flex-col items-center justify-center bg-[#050505] relative z-10 text-center">
                        <p className="text-[9px] tracking-[0.4em] text-white/20 uppercase mb-8">
                            © {new Date().getFullYear()} JWELLS S.A. · Excellence in Gold
                        </p>
                        <div className="flex gap-10">
                            {[Instagram, Twitter, Globe].map((Icon, i) => (
                                <button key={i} className="text-white/20 hover:text-[#D4AF37] transition-colors"><Icon size={14} /></button>
                            ))}
                        </div>
                    </footer>
                </div>
            </main>
        </SmoothScroll>
    )
}

// Helper for Footer icons
import { Instagram, Twitter, Globe } from 'lucide-react'
