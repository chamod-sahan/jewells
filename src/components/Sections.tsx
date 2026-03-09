'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, Instagram, Twitter, Globe } from 'lucide-react'

// ─── NAVIGTION ─────────────────────────────────────────────────────────────
export const Navbar = ({ show }: { show: boolean }) => (
    <motion.nav
        initial={{ y: -100 }}
        animate={{ y: show ? 0 : -100 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-8 md:px-32 py-8 pointer-events-auto"
    >
        <div className="flex items-center gap-6 group cursor-pointer overflow-hidden">
            <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 border border-[#D4AF37]/30 group-hover:rotate-90 transition-transform duration-1000" />
                <div className="w-1.5 h-1.5 bg-[#D4AF37]" />
            </div>
            <div className="flex flex-col">
                <div className="text-[14px] tracking-[1.2em] font-light text-white uppercase ml-[1.2em]">JWELLS</div>
                <div className="text-[7px] tracking-[0.6em] text-[#D4AF37]/50 uppercase ml-[0.6em] mt-1">L'ATELIER</div>
            </div>
        </div>

        <div className="hidden lg:flex items-center gap-16">
            {['The World', 'Artistry', 'Collection', 'Heritage'].map((link, i) => (
                <button
                    key={link}
                    className="relative text-[10px] tracking-[0.6em] uppercase text-white/40 hover:text-white transition-colors duration-500 overflow-hidden group"
                >
                    <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">{link}</span>
                    <span className="absolute left-0 top-full inline-block transition-transform duration-500 group-hover:-translate-y-full text-[#D4AF37]">{link}</span>
                </button>
            ))}
        </div>

        <button className="text-[10px] tracking-[0.5em] uppercase text-white border border-white/10 px-10 py-4 hover:bg-white hover:text-black transition-all duration-700">
            PRIVATE ACCESS
        </button>
    </motion.nav>
)

// ─── HOME/HERO (Brand Reveal) ──────────────────────────────────────────────
export const HeroSection = ({ showBrand }: { showBrand: boolean }) => (
    <div className="h-[100vh] flex items-center justify-center relative px-10 pointer-events-none">
        <AnimatePresence>
            {showBrand && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                >
                    <h1
                        className="text-5xl md:text-8xl lg:text-9xl font-light tracking-[0.3em] text-white leading-none mb-8 pl-[0.3em]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        JWELLS
                    </h1>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1.5 }}
                        className="flex flex-col items-center gap-4 mb-32"
                    >
                        <p className="text-[11px] md:text-[13px] tracking-[1.4em] text-[#D4AF37] uppercase ml-[1.4em] font-light">
                            The Art of Pure Mastery
                        </p>
                        <div className="w-12 h-[1px] bg-white/20" />
                        <p className="text-[8px] md:text-[9px] tracking-[0.8em] text-white/40 uppercase ml-[0.8em]">
                            Excellence in Every Reflection
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 2 }}
                        className="flex flex-col items-center gap-8"
                    >
                        <div className="text-[8px] tracking-[0.6em] text-white/20 uppercase ml-[0.6em]">Scroll to Reveal</div>
                        <div className="w-[1px] h-24 bg-gradient-to-b from-[#D4AF37] to-transparent" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
)

// ─── ABOUT US ───────────────────────────────────────────────────────────────
export const AboutSection = () => (
    <div className="min-h-screen flex items-center px-6 md:px-20 lg:px-32 relative z-10 pointer-events-auto py-20">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="flex flex-col items-center"
            >
                <p className="text-[9px] tracking-[1.0em] text-[#D4AF37]/80 uppercase mb-8">The Atelier</p>
                <h2
                    className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-10 px-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Generations of <span className="text-[#D4AF37] italic">Obsessive</span> Craftsmanship
                </h2>
                <p className="text-sm md:text-base tracking-[0.05em] text-white/50 leading-loose mb-12 max-w-2xl px-2">
                    Since 1924, JWELLS has defined the pinnacle of luxury. Each piece is hand-refined in our Geneva atelier, ensuring that every curve and every reflection is a testament to timeless beauty.
                </p>
                <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-10 px-2 w-full max-w-md">
                    {[
                        { num: '300+', label: 'Hours / piece' },
                        { num: '24K', label: 'Pure Gold' }
                    ].map(s => (
                        <div key={s.label}>
                            <div className="text-3xl md:text-4xl text-[#D4AF37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{s.num}</div>
                            <div className="text-[8px] tracking-[0.3em] text-[#D4AF37]/40 uppercase">{s.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </div>
)

// ─── JEWELLERY (Collection) ─────────────────────────────────────────────────
export const CollectionSection = () => {
    const items = [
        { name: 'Aurora Band', price: '€ 4,200', tag: 'Ring', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000' },
        { name: 'Celestial Chain', price: '€ 12,800', tag: 'Necklace', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000' },
        { name: 'Solaris Hoops', price: '€ 6,500', tag: 'Earrings', img: 'https://images.unsplash.com/photo-1635767798638-3e25273a8256?q=80&w=1000' },
        { name: 'Vortex Bangle', price: '€ 9,100', tag: 'Bracelet', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000' },
    ]
    return (
        <div className="min-h-screen py-32 md:py-64 px-6 md:px-20 lg:px-32 relative z-10 pointer-events-auto bg-black">
            <div className="max-w-7xl mx-auto w-full px-4 flex flex-col items-center">
                <div className="flex flex-col items-center text-center mb-24 md:mb-40 gap-12 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className="px-2"
                    >
                        <p className="text-[10px] tracking-[1.2em] text-[#D4AF37] uppercase mb-8">The Collection</p>
                        <h2 className="text-5xl md:text-8xl lg:text-9xl font-light text-white leading-[0.95]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Selected <span className="text-[#D4AF37] italic">Works</span>
                        </h2>
                    </motion.div>
                    <div className="flex flex-col items-center gap-6 px-6 max-w-2xl">
                        <p className="text-white/30 text-xs tracking-widest leading-relaxed font-light">
                            Each creation is a unique convergence of heritage and avant-garde design.
                        </p>
                        <button className="relative text-[10px] tracking-[0.4em] uppercase text-white hover:text-[#D4AF37] transition-all duration-500 pb-2 group flex flex-col items-center">
                            <span>VIEW FULL GALLERY</span>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-[#D4AF37]/40 group-hover:w-full transition-all duration-700" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 px-6">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="group cursor-none relative p-8 md:p-10 bg-white/[0.02] border border-white/[0.05] hover:border-[#D4AF37]/20 transition-all duration-700"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden mb-10 border border-white/5 bg-[#111]">
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1200ms] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-700" />

                                <div className="absolute top-6 left-6">
                                    <span className="text-[8px] tracking-[0.3em] text-white/40 group-hover:text-[#D4AF37] transition-colors uppercase font-medium">{item.tag}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 relative z-10 overflow-hidden group-hover:translate-x-2 transition-transform duration-700">
                                <h3 className="text-xl text-white font-light tracking-[0.05em]">{item.name}</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-4 h-[1px] bg-[#D4AF37]/50" />
                                    <p className="text-[11px] tracking-[0.2em] text-[#D4AF37] uppercase">{item.price}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── CONTACT ────────────────────────────────────────────────────────────────
export const ContactSection = () => (
    <div className="min-h-screen flex items-center px-6 md:px-20 lg:px-32 relative z-10 pointer-events-auto py-20">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center px-4">
            <div className="mb-20 flex flex-col items-center">
                <p className="text-[9px] tracking-[1.0em] text-[#D4AF37]/80 uppercase mb-8">Inquire</p>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05] mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Begin Your <span className="text-[#D4AF37] italic">Legacy</span>
                </h2>
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center">
                    {[
                        { Icon: Phone, text: '+41 22 123 4567', label: 'Geneva Head Atelier' },
                        { Icon: Mail, text: 'concierge@jwells.com', label: 'Private Appointments' },
                        { Icon: MapPin, text: 'Dubai · Tokyo · Paris', label: 'Global Presence' },
                    ].map(c => (
                        <div key={c.label} className="flex flex-col items-center group">
                            <div className="w-14 h-14 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-all duration-500 mb-4">
                                <c.Icon size={20} strokeWidth={1} />
                            </div>
                            <div>
                                <p className="text-white text-sm md:text-base tracking-[0.05em] font-light">{c.text}</p>
                                <p className="text-[8px] tracking-[0.3em] text-[#D4AF37]/40 uppercase mt-1 group-hover:text-[#D4AF37]/70 transition-colors">{c.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <form className="flex flex-col gap-8 w-full max-w-2xl px-6" onSubmit={e => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="group">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full bg-transparent border-b border-white/10 px-4 py-4 text-base text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-white/20 font-light tracking-wide"
                        />
                    </div>
                    <div className="group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-transparent border-b border-white/10 px-4 py-4 text-base text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-white/20 font-light tracking-wide"
                        />
                    </div>
                </div>
                <div className="group">
                    <textarea
                        rows={4}
                        placeholder="Message..."
                        className="w-full bg-transparent border-b border-white/10 px-4 py-4 text-base text-white focus:outline-none focus:border-[#D4AF37] transition-all resize-none placeholder:text-white/20 font-light tracking-wide"
                    />
                </div>
                <button type="submit" className="mt-8 border border-[#D4AF37]/40 text-[#D4AF37] py-5 uppercase tracking-[0.4em] text-[10px] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 w-full md:w-auto self-center px-12">
                    Request Consultation
                </button>
            </form>
        </div>
    </div>
)
