'use client'

import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
    PerspectiveCamera,
    Environment,
    Sparkles,
} from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { ScrollTunnel } from './ScrollTunnel'

const CameraRig = ({ scrollProgress }: { scrollProgress: number }) => {
    // Camera is now handled inside ScrollTunnel for more cinematic control
    return null
}

export const CinematicExperience = ({ scrollProgress }: { scrollProgress: number }) => {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ 
                    antialias: true, 
                    toneMapping: THREE.ACESFilmicToneMapping, 
                    toneMappingExposure: 1.5,
                    powerPreference: "high-performance"
                }}
            >
                <Suspense fallback={null}>
                    {/* Immersive Gold Dust Tunnel & Ring Effect */}
                    <ScrollTunnel scrollProgress={scrollProgress} />
                    
                    {/* The Sparkles add a finishing touch of floating dust outside the main tunnel */}
                    <Sparkles
                        count={400}
                        scale={[30, 30, 60]}
                        size={1.5}
                        speed={0.2}
                        color="#D4AF37"
                        opacity={0.4}
                    />
                </Suspense>
            </Canvas>
        </div>
    )
}
