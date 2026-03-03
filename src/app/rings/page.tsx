'use client'

import React from 'react'
import { ProductPage } from '../../components/ProductPage'

const products = [
    { name: 'Aurelius Noir', desc: 'Matte 24k with obsidian inlay, forged in total darkness.', price: '€ 48,000', tag: 'SIGNATURE', hue: 45, image: '/images/p-noir.png' },
    { name: 'Solstice Crown', desc: 'Twelve-faceted sun-gold, requiring 300 hours of micro-artistry.', price: '€ 72,000', tag: 'LIMITED', hue: 40, image: '/images/p-solstice.png' },
    { name: 'Equilibrium', desc: 'A minimalist gold band designed to mimic the curvature of silence.', price: '€ 120,000', tag: 'EXCLUSIVE', hue: 50, image: '/images/ring.png' },
    { name: 'Obsidian Core', desc: 'A singular pearl set against deep volcanic gold.', price: '€ 32,000', tag: 'RARE', hue: 35, image: '/images/ring-grid-1.png' },
    { name: 'Eternal Band', desc: 'Diamond-dusted infinity loop for the timeless soul.', price: '€ 96,000', tag: '', hue: 43, image: '/images/ring.png' },
]

export default function RingsPage() {
    return (
        <ProductPage
            title="The Rings"
            description="Our rings are more than jewelry; they are miniature monuments to the most profound human connections. Each piece is hand-casted in 24-karat gold and refined until perfection is achieved."
            products={products}
        />
    )
}
