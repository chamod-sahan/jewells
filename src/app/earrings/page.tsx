'use client'

import React from 'react'
import { ProductPage } from '../../components/ProductPage'

const products = [
    { name: 'Aurora Studs', desc: 'Diamond clusters mimicking the first light of dawn.', price: '€ 24,000', tag: 'SIGNATURE', hue: 50, image: '/images/earrings.png' },
    { name: 'Shimmer Drops', desc: 'Long-arc gold drops with micro-diamond tips.', price: '€ 18,000', tag: 'LIMITED', hue: 55, image: '/images/earrings.png' },
    { name: 'Gold Hoops', desc: '24k gold, hammered to a silk-like finish.', price: '€ 12,000', tag: 'HERITAGE', hue: 48, image: '/images/earrings.png' },
    { name: 'Lunar Clips', desc: 'Inspired by the craters of the moon, set with translucent pearls.', price: '€ 32,000', tag: 'RARE', hue: 42, image: '/images/earrings.png' },
]

export default function EarringsPage() {
    return (
        <ProductPage
            title="The Earrings"
            description="Our earrings are designed to frame the face with light. From the subtle whisper of a gold stud to the dramatic sweep of a diamond cluster, each pair is an exercise in elegance."
            products={products}
        />
    )
}
