import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
    title: 'JWELLS | Luxury Gold Heritage Collection',
    description: 'Experience the pinnacle of luxury craftsmanship. Timeless gold jewellery for the modern connoisseur.',
    keywords: 'jewelry, luxury, gold, heritage, JWELLS, cinematic',
    openGraph: {
        title: 'JWELLS | Luxury Gold Heritage',
        description: 'Experience the pinnacle of luxury craftsmanship.',
        type: 'website',
    }
}

import { BackgroundScene } from '../components/Experience'
import { CustomCursor } from '../components/CustomCursor'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-[#050505] text-white selection:bg-[#D4AF37]/30">
                <CustomCursor />
                <main className="relative z-10">{children}</main>
            </body>
        </html>
    )
}
