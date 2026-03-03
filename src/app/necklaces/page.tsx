'use client'

import React from 'react'
import { ProductPage } from '../../components/ProductPage'

const products = [
    { name: 'Heritage Chain', desc: 'Individually hand-welded links of 24k pure gold.', price: '€ 156,000', tag: 'MASTERS', hue: 45, image: '/images/necklace.png' },
    { name: 'Diamond Pendant', desc: 'A singular three-carat diamond suspended by a whisper.', price: '€ 82,000', tag: 'SIGNATURE', hue: 42, image: '/images/necklace.png' },
    { name: 'Celestial Halo', desc: 'Intricate gold wire-work around a crystalline core.', price: '€ 64,000', tag: 'NEW', hue: 48, image: '/images/necklace.png' },
    { name: 'Pearl Heritage', desc: 'Strands of the world\'s rarest natural pearls with a gold clasp.', price: '€ 112,000', tag: 'HERITAGE', hue: 52, image: '/images/ring-grid-1.png' },
]

export default function NecklacesPage() {
    return (
        <ProductPage
            title="The Necklaces"
            description="Our necklaces are more than accessories; they are masterpieces designed to be worn close to the heart. Every link and clasp is a testament to our artisanal legacy."
            products={products}
        />
    )
}
