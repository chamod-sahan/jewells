'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackgroundScene, ImageSequenceScroll } from '../components/Experience'
import {
    ChevronDown,
    Menu,
    X,
    Phone,
    Mail,
    MapPin,
    Instagram,
    Twitter,
    Globe,
    Star,
    ArrowRight,
    Diamond,
} from 'lucide-react'

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const SECTION_COUNT = 7
const SCROLL_COOLDOWN = 1500 // Increased for a more deliberate, luxury pace
const NAV_LABELS = ['Home', 'Brand', 'Collections', 'Rings', 'Earrings', 'Necklaces', 'Contact']

// ─── PAGE TRANSITION VARIANTS ────────────────────────────────────────────────
const pageVariants = {
    enter: (dir: number) => ({
        opacity: 0,
        y: dir > 0 ? '10%' : '-10%',
    }),
    center: {
        opacity: 1,
        y: '0%',
    },
    exit: (dir: number) => ({
        opacity: 0,
        y: dir > 0 ? '-10%' : '10%',
    }),
}

const pageTransition = {
    duration: 1.4, // Slower, more cinematic duration
    ease: [0.45, 0, 0.55, 1] as any, // Valid cinematic ease-in-out curve (cast to bypass strict lint)
}

// ─── SHARED TYPES ─────────────────────────────────────────────────────────────
interface SectionProps {
    onNext?: () => void
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const Navbar = ({ current, isHero, onNavigate }: { current: number; isHero: boolean; onNavigate: (i: number) => void }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()
    const isHome = pathname === '/'

    const handleNav = (i: number) => {
        const label = NAV_LABELS[i]
        if (label === 'Rings') window.location.href = '/rings'
        else if (label === 'Earrings') window.location.href = '/earrings'
        else if (label === 'Necklaces') window.location.href = '/necklaces'
        else if (isHome) onNavigate(i)
        else window.location.href = '/'
    }

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: isHero ? 0 : 1,
                    pointerEvents: isHero ? 'none' : 'auto'
                }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-10 md:px-24 py-8"
                style={{
                    backdropFilter: 'blur(30px)',
                    background: 'rgba(5,5,5,0.4)',
                    borderBottom: '1px solid rgba(212,175,55,0.08)',
                }}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-6 group cursor-pointer">
                    <div className="relative w-10 h-10">
                        <div className="absolute inset-0 border border-[#D4AF37]/30 group-hover:border-[#D4AF37] transition-all duration-700" style={{ transform: 'rotate(45deg)' }} />
                        <div className="absolute inset-[7px] border border-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 transition-all duration-700" style={{ transform: 'rotate(45deg)' }} />
                    </div>
                    <div className="flex flex-col">
                        <div className="text-[14px] tracking-[1.2em] font-light text-white uppercase pl-[1.2em]">JWELLS</div>
                        <div className="text-[7px] tracking-[0.6em] text-[#D4AF37]/40 uppercase pl-[0.6em] mt-1.5">Heritage Collection</div>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center gap-20">
                    {NAV_LABELS.map((link, i) => {
                        const isLink = ['Rings', 'Earrings', 'Necklaces'].includes(link)
                        const href = `/${link.toLowerCase()}`

                        if (isLink) return (
                            <Link
                                key={link}
                                href={href}
                                className={`text-[9px] tracking-[0.8em] uppercase transition-all duration-700 hover:scale-110 pl-[0.8em] ${pathname === href
                                    ? 'text-[#D4AF37]'
                                    : 'text-white/25 hover:text-[#D4AF37]'
                                    }`}
                            >
                                {link}
                            </Link>
                        )

                        return (
                            <button
                                key={link}
                                onClick={() => handleNav(i)}
                                className={`text-[9px] tracking-[0.8em] uppercase transition-all duration-700 hover:scale-110 pl-[0.8em] ${current === i && isHome
                                    ? 'text-[#D4AF37]'
                                    : 'text-white/25 hover:text-[#D4AF37]'
                                    }`}
                            >
                                {link}
                            </button>
                        )
                    })}
                </div>

                {/* CTA + hamburger */}
                <div className="flex items-center gap-4">
                    <button
                        className="hidden md:block text-[9px] tracking-[0.6em] uppercase text-[#D4AF37] border border-[#D4AF37]/20 px-10 py-4 hover:bg-[#D4AF37]/5 transition-all duration-700 pl-[0.6em]"
                    >
                        Reserve Now
                    </button>
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="md:hidden p-2 border border-white/10 hover:border-[#D4AF37]/30 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-white" />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex"
                    >
                        <div
                            onClick={() => setMenuOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            className="relative ml-auto w-80 h-full bg-[#0A0A0A] border-l border-[#D4AF37]/10 flex flex-col p-10"
                        >
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="absolute top-6 right-6 p-2 border border-white/10"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                            <div className="mt-16 flex flex-col gap-8">
                                {NAV_LABELS.map((link, i) => {
                                    const isLink = ['Rings', 'Earrings', 'Necklaces'].includes(link)
                                    const href = `/${link.toLowerCase()}`

                                    if (isLink) return (
                                        <Link
                                            key={link}
                                            href={href}
                                            onClick={() => setMenuOpen(false)}
                                            className={`text-left text-[11px] tracking-[0.4em] uppercase transition-colors duration-300 ${pathname === href ? 'text-[#D4AF37]' : 'text-white/60 hover:text-[#D4AF37]'}`}
                                        >
                                            {link}
                                        </Link>
                                    )

                                    return (
                                        <button
                                            key={link}
                                            onClick={() => { handleNav(i); setMenuOpen(false) }}
                                            className={`text-left text-[11px] tracking-[0.4em] uppercase transition-colors duration-300 ${current === i && isHome ? 'text-[#D4AF37]' : 'text-white/60 hover:text-[#D4AF37]'}`}
                                        >
                                            {link}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="mt-auto">
                                <div className="hr-gold mb-8" />
                                <button className="btn-gold w-full" style={{ fontSize: '9px' }}>Reserve Your Piece</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

// ─── SECTION DOTS ─────────────────────────────────────────────────────────────
const SectionDots = ({ current, total, onNavigate }: { current: number; total: number; onNavigate: (i: number) => void }) => (
    <div className="fixed right-7 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col gap-4">
        {Array.from({ length: total }).map((_, i) => (
            <button
                key={i}
                onClick={() => onNavigate(i)}
                className="group flex items-center gap-2 justify-end"
                aria-label={`Section ${i + 1}: ${NAV_LABELS[i]}`}
            >
                <span
                    className={`text-[7px] tracking-[0.2em] uppercase transition-all duration-300 pr-1 ${current === i
                        ? 'text-[#D4AF37] opacity-100'
                        : 'text-white/30 opacity-0 group-hover:opacity-100'
                        }`}
                >
                    {NAV_LABELS[i]}
                </span>
                <div
                    className={`rounded-full transition-all duration-400 flex-shrink-0 ${current === i
                        ? 'w-2.5 h-2.5 bg-[#D4AF37]'
                        : 'w-1.5 h-1.5 bg-white/25 group-hover:bg-[#D4AF37]/50'
                        }`}
                    style={current === i ? { boxShadow: '0 0 10px #D4AF37, 0 0 20px rgba(212,175,55,0.3)' } : {}}
                />
            </button>
        ))}
    </div>
)

// ─── SECTION PROGRESS BAR ─────────────────────────────────────────────────────
const ProgressBar = ({ current, total }: { current: number; total: number }) => (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2">
        <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className="h-[2px] rounded-full transition-all duration-500"
                    style={{
                        width: current === i ? 24 : 8,
                        background: current === i ? '#D4AF37' : 'rgba(255,255,255,0.15)',
                    }}
                />
            ))}
        </div>
        <span className="text-[7px] tracking-[0.4em] text-white/25 uppercase">
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
    </div>
)

// ─── SECTION 0: LANDING (Pure Art) ──────────────────────────────────────────
const LandingSection = ({ onNext }: SectionProps) => (
    <div className="h-screen flex flex-col items-center justify-center relative select-none overflow-hidden">
        {/* Decorative corner accents */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
            className="absolute inset-12 pointer-events-none"
        >
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#D4AF37]/20" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#D4AF37]/20" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#D4AF37]/20" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#D4AF37]/20" />
        </motion.div>

        {/* Minimal center indicator to invite interaction */}
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="w-16 h-16 flex items-center justify-center opacity-40 z-10"
        >
            <div className="absolute w-full h-full border border-[#D4AF37] rotate-45 border-dashed animate-[spin_10s_linear_infinite]" />
            <Diamond className="w-6 h-6 text-[#D4AF37]" />
        </motion.div>

        {/* Swipe/Scroll hint */}
        <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1.5 }}
            onClick={onNext}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 group cursor-pointer"
        >
            <div className="text-[7px] tracking-[0.8em] text-white/20 uppercase pl-[0.8em] group-hover:text-[#D4AF37]/50 transition-colors duration-500">Discover</div>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37]/30 to-transparent group-hover:h-20 transition-all duration-700" />
        </motion.button>
    </div>
)

// ─── SECTION 1: BRAND REVEAL (Storytelling) ──────────────────────────────────
const BrandSection = () => {
    const brandName = "JWELLS"
    return (
        <div className="h-screen flex flex-col items-center justify-center relative select-none overflow-hidden text-center px-8">
            <div className="flex flex-col items-center gap-20">
                <div className="flex overflow-hidden py-2 px-8">
                    {brandName.split('').map((char, i) => (
                        <motion.span
                            key={i}
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                delay: 0.4 + (i * 0.12),
                                duration: 1.4,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className="text-7xl md:text-[9.5rem] font-light tracking-[0.5em] text-white leading-none pl-[0.5em]"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </div>

                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 140, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1.5 }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"
                />

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 1.2 }}
                    className="text-[11px] tracking-[1.2em] text-[#D4AF37]/80 uppercase pl-[1.2em]"
                >
                    Timeless Jewellery Collection
                </motion.p>
            </div>
        </div>
    )
}

// ─── SECTION 2: COLLECTIONS ───────────────────────────────────────────────────
const collections = [
    { name: 'Rings', count: '24 Pieces', tagline: 'Eternal circles', hue: 45, image: '/images/ring.png' },
    { name: 'Necklaces', count: '18 Pieces', tagline: 'Worn close to the soul', hue: 40, image: '/images/necklace.png' },
    { name: 'Earrings', count: '32 Pieces', tagline: 'Whispers of gold', hue: 50, image: '/images/earrings.png' },
    { name: 'Bracelets', count: '16 Pieces', tagline: 'Bound in luxury', hue: 43, image: '/images/bracelet.png' },
]

const CollectionsSection = () => (
    <div
        className="h-screen flex flex-col items-center justify-center px-8 md:px-24"
        style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.88) 0%, rgba(10,10,10,0.97) 100%)' }}
    >
        <div className="max-w-7xl mx-auto w-full px-12 md:px-32">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-24"
            >
                <p className="text-[11px] tracking-[1.2em] text-[#D4AF37]/60 uppercase mb-8 pl-[1.2em]">The Collection</p>
                <h2 className="text-4xl md:text-8xl font-light text-white leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Objects of <span className="text-gradient-gold italic">impossible beauty</span>
                </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {collections.map((col, i) => (
                    <Link
                        key={col.name}
                        href={['Rings', 'Earrings', 'Necklaces'].includes(col.name) ? `/${col.name.toLowerCase()}` : '#'}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                        >
                            <div className="group cursor-pointer relative overflow-hidden card-glass h-64 md:h-80 flex flex-col justify-end p-6">
                                {/* Product Image background */}
                                <motion.div
                                    className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <img
                                        src={col.image}
                                        alt={col.name}
                                        className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
                                    />
                                </motion.div>

                                {/* Background glow overlay */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[1]"
                                    style={{ background: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%), radial-gradient(ellipse at 50% 50%, hsla(${col.hue}, 60%, 40%, 0.12) 0%, transparent 70%)` }}
                                />

                                {/* Rotating ring decoration (now as subtle overlay) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] z-[2] pointer-events-none">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20 + i * 3, repeat: Infinity, ease: 'linear' }}
                                        className="w-32 h-32 rounded-full opacity-20"
                                        style={{ border: `1px solid hsla(${col.hue}, 60%, 55%, 0.2)` }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{
                                                background: `hsl(${col.hue}, 60%, 55%)`,
                                                boxShadow: `0 0 12px hsl(${col.hue}, 60%, 55%)`,
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* Corner brackets */}
                                {(['top-3 left-3 border-t border-l', 'top-3 right-3 border-t border-r', 'bottom-3 left-3 border-b border-l', 'bottom-3 right-3 border-b border-r']).map((cls) => (
                                    <div key={cls} className={`absolute w-4 h-4 ${cls} border-[#D4AF37]/25 group-hover:border-[#D4AF37]/60 transition-colors duration-300`} />
                                ))}
                                {/* Content */}
                                <div className="relative z-10 px-2 pb-2">
                                    <h3 className="text-2xl font-light text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-500" style={{ fontFamily: "'Playfair Display', serif" }}>{col.name}</h3>
                                    <p className="text-[8px] tracking-[0.5em] text-[#D4AF37]/50 uppercase mb-2 pl-[0.5em]">{col.count}</p>
                                    <p className="text-[10px] tracking-[0.08em] text-white/20 italic font-light group-hover:text-white/40 transition-colors duration-700">{col.tagline}</p>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
)

// ─── SECTION 3: FEATURED PRODUCTS ────────────────────────────────────────────
const products = [
    { name: 'Aurelius Noir', desc: 'Matte 24k with obsidian inlay', price: '€ 48,000', tag: 'SIGNATURE', hue: 45, image: '/images/p-noir.png' },
    { name: 'Solstice Crown', desc: 'Twelve-faceted sun-gold, 300h craft', price: '€ 72,000', tag: 'LIMITED', hue: 40, image: '/images/p-solstice.png' },
    { name: 'Equilibrium', desc: 'Magnetic levitation presentation', price: '€ 120,000', tag: 'EXCLUSIVE', hue: 50, image: '/images/ring.png' },
    { name: 'Celeste Band', desc: 'Diamond-dusted night sky engraving', price: '€ 96,000', tag: 'RARE', hue: 43, image: '/images/necklace.png' },
]

const FeaturedProductsSection = () => (
    <div
        className="h-screen flex flex-col items-center justify-center px-8 md:px-24"
        style={{ background: 'rgba(8,8,8,0.97)' }}
    >
        <div className="max-w-7xl mx-auto w-full px-12 md:px-32">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-end justify-between mb-24"
            >
                <div>
                    <p className="text-[11px] tracking-[1.2em] text-[#D4AF37]/60 uppercase mb-8 pl-[1.2em]">Featured Pieces</p>
                    <h2 className="text-4xl md:text-7xl font-light text-white leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Crafted for <span className="text-gradient-gold italic">eternity</span>
                    </h2>
                </div>
                <button className="btn-outline-gold hidden md:block tracking-[0.8em] text-[10px] py-5 px-12 pl-[0.8em]">VIEW ALL</button>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {products.map((p, i) => (
                    <motion.div
                        key={p.name}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                    >
                        <motion.div
                            className="group cursor-pointer card-glass overflow-hidden flex flex-col"
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Visual area */}
                            <div
                                className="relative h-48 md:h-56 overflow-hidden"
                            >
                                {/* Static Product Image */}
                                <motion.img
                                    src={p.image}
                                    alt={p.name}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                                />

                                {/* Subtle Radial Glow */}
                                <div
                                    className="absolute inset-0 z-[1] opacity-30"
                                    style={{ background: `radial-gradient(ellipse at 50% 60%, hsla(${p.hue}, 55%, 35%, 0.2) 0%, rgba(0,0,0,0.92) 80%)` }}
                                />

                                {/* Animated ring overlay (Subtle) */}
                                <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 18 + i * 2, repeat: Infinity, ease: 'linear' }}
                                        className="w-24 h-24 rounded-full opacity-10"
                                        style={{ border: `1px solid hsla(${p.hue}, 60%, 55%, 0.4)` }}
                                    />
                                    <div
                                        className="absolute w-1.5 h-1.5 rounded-full opacity-40"
                                        style={{ background: `hsl(${p.hue}, 60%, 55%)`, boxShadow: `0 0 10px hsl(${p.hue}, 60%, 55%)` }}
                                    />
                                </div>
                                {/* Tag */}
                                <div className="absolute top-3 left-3">
                                    <span className="text-[7px] tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 uppercase">
                                        {p.tag}
                                    </span>
                                </div>
                                {/* Hover shine + zoom */}
                                <motion.div
                                    className="absolute inset-0"
                                    initial={{ opacity: 0, scale: 1 }}
                                    whileHover={{ opacity: 1, scale: 1.06 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ background: 'rgba(212,175,55,0.04)' }}
                                />
                            </div>

                            {/* Info */}
                            <div className="p-4 md:p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-sm text-white font-light leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {p.name}
                                    </h3>
                                    <span className="text-[9px] text-[#D4AF37] font-medium ml-2 flex-shrink-0">{p.price}</span>
                                </div>
                                <p className="text-[9px] text-white/30 leading-relaxed mb-4 flex-1">{p.desc}</p>
                                <div className="flex items-center gap-2 text-[8px] tracking-[0.25em] text-[#D4AF37]/60 uppercase group-hover:text-[#D4AF37] transition-colors duration-300">
                                    Inquire <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
)

// ─── SECTION 4: CRAFTSMANSHIP ─────────────────────────────────────────────────
const stats = [
    { num: '300+', label: 'Hours / piece' },
    { num: '24K', label: 'Pure gold' },
    { num: '1924', label: 'Est.' },
    { num: '12', label: 'Master artisans' },
]

const steps = [
    'Concept & Design',
    'Gold Casting',
    'Hand Refinement',
    'Micro Engraving',
    'Final Certification',
]

const CraftsmanshipSection = () => (
    <div
        className="h-screen flex items-center px-8 md:px-24"
        style={{ background: 'rgba(5,5,5,0.98)' }}
    >
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Left */}
            <div>
                <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-[10px] tracking-[0.8em] text-[#D4AF37]/70 uppercase mb-8 pl-[0.8em]"
                >
                    The Craft
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl md:text-7xl font-light text-white leading-[1.05] mb-10"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Obsessive <span className="text-gradient-gold italic">precision</span><br />in every detail
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-sm tracking-[0.05em] text-white/25 leading-loose mb-12 max-w-lg"
                >
                    Our Geneva atelier is sealed from the world — temperature-controlled,
                    vibration-free, lit by a single overhead source. Conditions that mirror
                    the void we seek to capture in every creation.
                </motion.p>

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                        >
                            <div
                                className="text-3xl md:text-4xl font-light text-gradient-gold mb-2"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {s.num}
                            </div>
                            <div className="text-[8px] tracking-[0.3em] text-[#D4AF37]/40 uppercase pl-[0.3em]">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right — Process timeline */}
            <div>
                <div className="relative pl-10">
                    {/* Vertical gold line */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent"
                        style={{ transformOrigin: 'top' }}
                    />
                    {steps.map((step, i) => (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 + i * 0.14 }}
                            className="relative mb-9 last:mb-0"
                        >
                            {/* Node */}
                            <div className="absolute -left-[43px] top-1.5 w-3.5 h-3.5 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                            </div>
                            <div className="text-[10px] tracking-[0.5em] text-[#D4AF37]/40 uppercase mb-3 pl-[0.5em]">
                                {String(i + 1).padStart(2, '0')}
                            </div>
                            <div className="text-[14px] text-white/40 font-light tracking-[0.05em] leading-loose max-w-xs">{step}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

// ─── SECTION 5: REVIEWS ───────────────────────────────────────────────────────
const reviews = [
    {
        quote: 'Holding a JWELLS piece is like holding a collapsed star. Time stops.',
        name: 'Duchess A. von Hessler',
        title: 'Collector, Vienna',
        stars: 5,
    },
    {
        quote: 'I have worn the finest houses. None has made me feel this way. This is the future of luxury.',
        name: 'Sheikh M. Al-Rashid',
        title: 'Connoisseur, Dubai',
        stars: 5,
    },
    {
        quote: 'The anti-gravity effect is not a gimmick — it is a philosophical statement about permanence.',
        name: 'Prof. L. Fontaine',
        title: 'Art Theorist, Paris',
        stars: 5,
    },
]

const ReviewsSection = () => {
    const [active, setActive] = useState(0)

    useEffect(() => {
        const t = setInterval(() => setActive(a => (a + 1) % reviews.length), 4500)
        return () => clearInterval(t)
    }, [])

    return (
        <div
            className="h-screen flex items-center justify-center px-8 md:px-24"
            style={{ background: 'rgba(7,7,7,0.98)' }}
        >
            <div className="max-w-4xl mx-auto text-center w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center justify-center gap-4 mb-14">
                        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
                        <p className="text-[9px] tracking-[0.6em] text-[#D4AF37] uppercase">Testimonials</p>
                        <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
                    </div>
                </motion.div>

                <div className="relative min-h-72 flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.98 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                            <div
                                className="text-9xl text-[#D4AF37]/5 mb-10 leading-none"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                "
                            </div>
                            <div className="flex justify-center gap-2.5 mb-12">
                                {Array(reviews[active].stars).fill(0).map((_, i) => (
                                    <Star key={i} className="w-4.5 h-4.5 fill-[#D4AF37] text-[#D4AF37]/30" />
                                ))}
                            </div>
                            <p
                                className="text-2xl md:text-4xl font-light text-white/80 leading-[1.6] mb-14 italic max-w-4xl tracking-[0.02em]"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {reviews[active].quote}
                            </p>
                            <div className="w-16 h-[1px] bg-[#D4AF37]/15 mb-10" />
                            <p className="text-[12px] tracking-[0.4em] uppercase text-white/60 font-light mb-2 pl-[0.4em]">{reviews[active].name}</p>
                            <p className="text-[10px] tracking-[0.8em] text-[#D4AF37]/40 uppercase pl-[0.8em]">{reviews[active].title}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-3 mt-8">
                    {reviews.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className="rounded-full transition-all duration-400"
                            style={{
                                width: active === i ? 24 : 6,
                                height: 6,
                                background: active === i ? '#D4AF37' : 'rgba(255,255,255,0.18)',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── SECTION 6: CONTACT ───────────────────────────────────────────────────────
const ContactSection = () => (
    <div
        className="h-screen flex items-center px-8 md:px-24"
        style={{ background: 'rgba(5,5,5,0.99)' }}
    >
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 md:gap-24">
            {/* Left */}
            <div>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-[11px] tracking-[1.2em] text-[#D4AF37]/60 uppercase mb-8 pl-[1.2em]"
                >
                    Contact
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl md:text-7xl font-light text-white mb-10 leading-[1.05]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Begin your <span className="text-gradient-gold italic">legacy</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-sm tracking-[0.05em] text-white/25 leading-loose mb-14 max-w-lg"
                >
                    Each JWELLS creation begins with a private consultation.
                    Our artisans travel to meet you — because extraordinary pieces
                    deserve extraordinary introductions.
                </motion.p>

                <div className="flex flex-col gap-8">
                    {[
                        { Icon: Phone, text: '+41 22 000 0000', label: 'Geneva Atelier' },
                        { Icon: Mail, text: 'private@jwells.com', label: 'Private Inquiries' },
                        { Icon: MapPin, text: 'Geneva · Dubai · Tokyo', label: 'Ateliers Worldwide' },
                    ].map(({ Icon, text, label }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                            className="flex items-center gap-8"
                        >
                            <div className="w-14 h-14 border border-[#D4AF37]/10 flex items-center justify-center flex-shrink-0 group hover:border-[#D4AF37]/30 transition-all duration-700">
                                <Icon className="w-4.5 h-4.5 text-[#D4AF37]/70" />
                            </div>
                            <div>
                                <div className="text-[14px] tracking-[0.1em] text-white/50 font-light pl-[0.1em]">{text}</div>
                                <div className="text-[9px] tracking-[0.6em] text-[#D4AF37]/30 uppercase mt-2 pl-[0.6em]">{label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Social */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex gap-3 mt-10"
                >
                    {[Instagram, Twitter, Globe].map((Icon, i) => (
                        <button
                            key={i}
                            className="w-10 h-10 border border-white/10 hover:border-[#D4AF37]/50 flex items-center justify-center transition-all duration-300 hover:bg-[#D4AF37]/5"
                        >
                            <Icon className="w-4 h-4 text-white/35 hover:text-[#D4AF37] transition-colors" />
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Right — Form */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
                    {[
                        { id: 'name', placeholder: 'Full Name', type: 'text' },
                        { id: 'email', placeholder: 'Email Address', type: 'email' },
                        { id: 'phone', placeholder: 'Phone Number', type: 'tel' },
                    ].map(f => (
                        <input
                            key={f.id}
                            type={f.type}
                            placeholder={f.placeholder}
                            className="w-full px-5 py-4 text-white text-sm placeholder:text-white/18 focus:outline-none transition-colors duration-300"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)' }}
                            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                        />
                    ))}
                    <textarea
                        rows={4}
                        placeholder="Tell us about your vision..."
                        className="w-full px-5 py-4 text-white text-sm placeholder:text-white/18 focus:outline-none resize-none transition-colors duration-300"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)' }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                    />
                    <button type="submit" className="btn-gold w-full mt-2">
                        Request Private Consultation
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[8px] tracking-[0.2em] text-white/18 uppercase">
                        © {new Date().getFullYear()} JWELLS S.A. · Geneva
                    </p>
                    <div className="flex items-center gap-1">
                        <Diamond className="w-2.5 h-2.5 text-[#D4AF37]/30" />
                        <span className="text-[8px] tracking-[0.2em] text-white/18 uppercase">Excellence in Craft</span>
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
)

// ─── SECTIONS REGISTRY ────────────────────────────────────────────────────────
// Removed the direct array and moved it into the component to allow `onNext` prop
// const SECTIONS: React.ComponentType<SectionProps>[] = [
//     HeroSection,
//     CollectionsSection,
//     FeaturedProductsSection,
//     CraftsmanshipSection,
//     ReviewsSection,
//     ContactSection,
// ]

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) { clearInterval(interval); setTimeout(onDone, 400); return 100 }
                return Math.min(100, p + Math.random() * 4 + 1)
            })
        }, 35)
        return () => clearInterval(interval)
    }, [onDone])

    return (
        <motion.div
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center gap-12"
        >
            {/* Spinning ring loader */}
            <div className="relative w-24 h-24">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-[#D4AF37]/15"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-2 rounded-full border-t border-r border-[#D4AF37]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2.5 h-2.5 bg-[#D4AF37] rotate-45"
                        style={{ boxShadow: '0 0 16px #D4AF37' }}
                    />
                </div>
            </div>

            <motion.p
                initial={{ opacity: 0, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, letterSpacing: '1.2em' }}
                transition={{ duration: 1.5 }}
                className="text-[14px] text-[#D4AF37] uppercase font-light pl-[1.2em]"
            >
                JWELLS
            </motion.p>

            {/* Progress */}
            <div className="flex flex-col items-center gap-4">
                <div className="w-56 h-[1px] bg-white/5 relative">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37] to-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-[10px] tracking-[0.6em] text-[#D4AF37]/30 uppercase pl-[0.6em]">
                    {Math.floor(progress)}
                </span>
            </div>
        </motion.div>
    )
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(1)
    const [isAnimating, setIsAnimating] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const touchStartY = useRef(0)

    // Use refs for animation state to avoid listener desync
    const isAnimatingRef = useRef(false)
    const currentRef = useRef(0)

    // Sync ref with state
    useEffect(() => {
        currentRef.current = current
    }, [current])

    const goTo = useCallback((index: number) => {
        if (index === currentRef.current || isAnimatingRef.current) return

        const dir = index > currentRef.current ? 1 : -1
        setDirection(dir)
        setCurrent(index)

        isAnimatingRef.current = true
        setIsAnimating(true)

        setTimeout(() => {
            isAnimatingRef.current = false
            setIsAnimating(false)
        }, SCROLL_COOLDOWN)
    }, []) // simplified dependencies

    const next = useCallback(() => {
        if (currentRef.current < SECTION_COUNT - 1) {
            goTo(currentRef.current + 1)
        }
    }, [goTo])

    const prev = useCallback(() => {
        if (currentRef.current > 0) {
            goTo(currentRef.current - 1)
        }
    }, [goTo])

    // ── Wheel scroll ────────────────────────────────────────────────────────
    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (isAnimatingRef.current) return

            // Normalize scroll intensity (some mouses are subtle)
            if (Math.abs(e.deltaY) < 10) return

            if (e.deltaY > 0) {
                next()
            } else {
                prev()
            }
        }
        window.addEventListener('wheel', onWheel, { passive: false })
        return () => window.removeEventListener('wheel', onWheel)
    }, [next, prev])

    // ── Touch scroll ────────────────────────────────────────────────────────
    useEffect(() => {
        const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY }
        const onTouchEnd = (e: TouchEvent) => {
            if (isAnimatingRef.current) return
            const delta = touchStartY.current - e.changedTouches[0].clientY

            // Threshold for swipe
            if (Math.abs(delta) > 30) {
                delta > 0 ? next() : prev()
            }
        }
        window.addEventListener('touchstart', onTouchStart, { passive: true })
        window.addEventListener('touchend', onTouchEnd, { passive: true })
        return () => {
            window.removeEventListener('touchstart', onTouchStart)
            window.removeEventListener('touchend', onTouchEnd)
        }
    }, [next, prev])

    // ── Keyboard navigation ──────────────────────────────────────────────────
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (isAnimatingRef.current) return
            if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); next() }
            if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); prev() }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [next, prev])

    // Dynamic section rendering
    const CurrentSection = ({ onNext }: SectionProps) => {
        const SECTIONS = [
            <LandingSection onNext={onNext} />,
            <BrandSection />,
            <CollectionsSection />,
            <FeaturedProductsSection />,
            <CraftsmanshipSection />,
            <ReviewsSection />,
            <ContactSection />,
        ]
        return SECTIONS[current] || null
    }

    const isHero = current === 0
    const isBrand = current === 1

    return (
        <>
            {/* ── Layer 1: Gold animation video (Storytelling transformation) ── */}
            <motion.div
                animate={{
                    opacity: isHero ? 1 : 0.18,
                    y: isHero ? '0%' : (isBrand ? '-10%' : '-32%'),
                    scale: isHero ? 1 : (isBrand ? 0.88 : 0.65),
                }}
                transition={{
                    duration: 1.8,
                    ease: [0.45, 0, 0.55, 1],
                }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                    filter: isHero ? 'none' : (isBrand ? 'blur(2px)' : 'blur(4px)')
                }}
            >
                <ImageSequenceScroll />
            </motion.div>

            {/* ── Layer 2: Dark tint (Atmospheric shift) ── */}
            <motion.div
                animate={{ opacity: isHero ? 0.2 : (isBrand ? 0.35 : 0.7) }}
                transition={{ duration: 1.8, ease: [0.45, 0, 0.55, 1] }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 2,
                    pointerEvents: 'none',
                    background: '#000',
                }}
            />

            {/* ── Layer 3: Section content ── */}
            <div className="fixed inset-0 z-10 overflow-hidden">
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={pageTransition}
                        className="absolute inset-0"
                    >
                        <CurrentSection onNext={next} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Layer 4: UI Chrome ── */}
            <Navbar current={current} isHero={isHero} onNavigate={goTo} />
            <SectionDots current={current} total={SECTION_COUNT} onNavigate={goTo} />
            <ProgressBar current={current} total={SECTION_COUNT} />

            {/* ── Loading screen ── */}
            <AnimatePresence>
                {!loaded && (
                    <LoadingScreen key="loader" onDone={() => setLoaded(true)} />
                )}
            </AnimatePresence>
        </>
    )
}
