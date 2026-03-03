'use client'

import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
    OrbitControls,
    PerspectiveCamera,
    Environment,
    MeshReflectorMaterial,
    Sparkles,
} from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

// ─── Marble Floor ────────────────────────────────────────────────────────────
const MarbleFloor = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={1024}
            mixBlur={1.2}
            mixStrength={60}
            roughness={1}
            depthScale={1.4}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.8}
            mirror={0}
        />
    </mesh>
)

// ─── Volumetric God Ray Light ─────────────────────────────────────────────────
const GodRayLight = () => {
    const coneRef = useRef<THREE.Mesh>(null)
    useFrame(({ clock }) => {
        if (!coneRef.current) return
        const mat = coneRef.current.material as THREE.MeshBasicMaterial
        mat.opacity = 0.04 + Math.sin(clock.getElapsedTime() * 0.5) * 0.015
    })
    return (
        <group>
            <spotLight position={[0, 10, 0]} angle={0.12} penumbra={1} distance={25} intensity={200} color="#FFA040" castShadow />
            <spotLight position={[3, 8, 2]} angle={0.3} penumbra={1} distance={20} intensity={40} color="#FF8C00" />
            <pointLight position={[-3, 2, -2]} intensity={10} color="#4080FF" distance={8} />
            <mesh ref={coneRef} position={[0, 2, 0]}>
                <coneGeometry args={[3.5, 12, 64, 1, true]} />
                <meshBasicMaterial color="#FFA040" transparent opacity={0.05} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <ambientLight intensity={0.05} />
        </group>
    )
}

// ─── 3D Background Scene (pure ambience) ─────────────────────────────────────
export const BackgroundScene = () => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas
            shadows
            dpr={[1, 1.5]}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        >
            <PerspectiveCamera makeDefault position={[0, 0.5, 5.5]} fov={42} />
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#000000', 10, 22]} />

            <Suspense fallback={null}>
                <Environment preset="city" />
                <MarbleFloor />
                <GodRayLight />
                <Sparkles count={200} scale={12} size={1.5} speed={0.25} color="#D4AF37" opacity={0.35} />
                <OrbitControls enabled={false} />
                <EffectComposer enableNormalPass={false}>
                    <Bloom intensity={1.8} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur />
                    <Noise opacity={0.035} />
                    <Vignette eskil={false} offset={0.15} darkness={1.4} />
                </EffectComposer>
            </Suspense>
        </Canvas>
    </div>
)

// ─── Video Auto-Play — Maximum Quality ───────────────────────────────────────
// Using the native <video> element is the highest-quality approach:
// - GPU hardware-decoded (no canvas artifacts)
// - Browser-native smooth playback at the video's own frame rate
// - Perfect color fidelity from the original MP4
// - Zero JavaScript frame-stepping overhead
export const ImageSequenceScroll = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [ready, setReady] = React.useState(false)

    React.useEffect(() => {
        const v = videoRef.current
        if (!v) return
        const onCanPlay = () => {
            setReady(true)
            v.play().catch(() => { })
        }
        v.addEventListener('canplay', onCanPlay)
        return () => v.removeEventListener('canplay', onCanPlay)
    }, [])

    return (
        <div className="relative w-full h-full overflow-hidden pointer-events-none">
            <video
                ref={videoRef}
                src="/animation.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
                style={{
                    opacity: ready ? 1 : 0,
                    transition: 'opacity 1.5s ease',
                    mixBlendMode: 'screen',
                    willChange: 'transform',
                }}
            />
        </div>
    )
}

// ─── Legacy export alias ──────────────────────────────────────────────────────
export const Experience = BackgroundScene
