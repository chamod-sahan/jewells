'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Diamond, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Product {
    name: string
    desc: string
    price: string
    tag: string
    image: string
    hue: number
}

interface ProductPageProps {
    title: string
    description: string
    products: Product[]
}

export const ProductPage = ({ title, description, products }: ProductPageProps) => {
    return (
        <div className="min-h-screen py-40 px-8 md:px-24 relative">
            {/* Header */}
            <div className="max-w-7xl mx-auto w-full mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
                <div className="flex flex-col gap-8">
                    <Link href="/" className="group flex items-center gap-3 text-[10px] tracking-[0.4em] text-[#D4AF37]/60 hover:text-[#D4AF37] uppercase transition-all duration-500 pl-[0.4em]">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                        Back to Heritage
                    </Link>
                    <div>
                        <p className="text-[11px] tracking-[0.8em] text-[#D4AF37]/50 uppercase mb-4 pl-[0.8em]">Collection</p>
                        <h1 className="text-6xl md:text-[6rem] font-light text-white leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {title}
                        </h1>
                    </div>
                </div>
                <p className="text-[14px] tracking-[0.05em] text-white/25 max-w-sm leading-relaxed mb-4">
                    {description}
                </p>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((p, i) => (
                    <motion.div
                        key={p.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="group cursor-pointer card-glass flex flex-col h-full overflow-hidden"
                    >
                        {/* Image Container */}
                        <div className="relative h-64 overflow-hidden">
                            <motion.img
                                src={p.image}
                                alt={p.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                            />
                            {/* Overlay */}
                            <div
                                className="absolute inset-0 z-[1] opacity-30"
                                style={{ background: `radial-gradient(ellipse at 50% 60%, hsla(${p.hue}, 55%, 35%, 0.2) 0%, rgba(0,0,0,0.92) 80%)` }}
                            />
                            {/* Tag */}
                            {p.tag && (
                                <div className="absolute top-4 left-4 z-[2]">
                                    <span className="text-[7px] tracking-[0.4em] text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 uppercase backdrop-blur-md pl-[0.4em]">
                                        {p.tag}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-[11px] tracking-[0.25em] uppercase text-white font-light group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {p.name}
                                </h3>
                                <span className="text-[10px] tracking-[0.1em] text-[#D4AF37] font-medium ml-2">{p.price}</span>
                            </div>
                            <p className="text-[10px] tracking-[0.05em] leading-loose text-white/30 mb-8 flex-1">
                                {p.desc}
                            </p>
                            <div className="flex items-center gap-3 text-[8px] tracking-[0.5em] text-[#D4AF37]/50 uppercase group-hover:text-[#D4AF37] transition-colors duration-500 pl-[0.5em]">
                                Inquire Now <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer decoration */}
            <div className="max-w-7xl mx-auto w-full mt-32 flex justify-center opacity-10">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
                    <Diamond className="w-4 h-4 text-[#D4AF37]" />
                    <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
                </div>
            </div>
        </div>
    )
}
