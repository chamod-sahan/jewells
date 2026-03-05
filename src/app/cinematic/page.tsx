'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const PremiumScrollExperience = dynamic(
  () => import('../../components/PremiumScrollExperience'),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border border-[#D4AF37]/20 rounded-full animate-spin border-t-[#D4AF37]" />
          <span className="text-[10px] tracking-[0.6em] text-[#D4AF37]/50 uppercase">
            Loading Experience...
          </span>
        </div>
      </div>
    )
  }
)

export default function CinematicPage() {
  return (
    <main className="bg-[#050505]">
      <Suspense fallback={null}>
        <PremiumScrollExperience />
      </Suspense>
    </main>
  )
}
