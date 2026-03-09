'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Float, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

const PARTICLE_COUNT = 40000 // Reduced for better performance and "airier" feel
const TUNNEL_LENGTH = 100.0
const TUNNEL_RADIUS = 15.0

const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uMouse;
  
  attribute float aSize;
  attribute float aOffset;
  attribute float aSpeed;
  attribute vec3 aColor;
  
  varying float vAlpha;
  varying vec3 vColor;
  
  void main() {
    vec3 pos = position;
    
    // Slow, elegant floating movement
    float time = uTime * 0.2 + uScrollProgress * 5.0;
    float zOffset = mod(pos.z + time * aSpeed * 10.0, 100.0) - 50.0;
    
    // Gentle waving motion
    float wave = sin(zOffset * 0.1 + uTime * 0.5) * 2.0;
    pos.x += wave * aOffset;
    pos.y += cos(zOffset * 0.1 + uTime * 0.4) * 2.0;
    
    // Mouse Interaction (Parallax)
    pos.x += uMouse.x * (zOffset + 50.0) * 0.1;
    pos.y += uMouse.y * (zOffset + 50.0) * 0.1;
    
    pos.z = zOffset;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Smooth distance fading
    float distanceFade = 1.0 - smoothstep(10.0, 50.0, -mvPosition.z);
    float nearFade = smoothstep(0.0, 5.0, -mvPosition.z);
    
    // Elegant shimmer/twinkle
    float twinkle = 0.6 + 0.4 * sin(uTime * aSpeed * 2.0 + aOffset * 10.0);
    
    vAlpha = distanceFade * nearFade * twinkle * 0.6;
    vColor = aColor;
    
    gl_PointSize = aSize * (1200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Ultra-soft glow for "Luxury" feel
    float glow = pow(1.0 - dist * 2.0, 2.0);
    float core = pow(1.0 - dist * 2.0, 10.0) * 1.5;
    
    gl_FragColor = vec4(vColor + core, vAlpha * glow);
  }
`

function ShimmerParticles({ scrollProgress }: { scrollProgress: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const mouse = useRef(new THREE.Vector2(0, 0))
  
  const { positions, sizes, offsets, speeds, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const sz = new Float32Array(PARTICLE_COUNT)
    const off = new Float32Array(PARTICLE_COUNT)
    const sp = new Float32Array(PARTICLE_COUNT)
    const col = new Float32Array(PARTICLE_COUNT * 3)
    
    const palette = [
      '#F3E5AB', // Soft Vanilla Gold
      '#D4AF37', // Metallic Gold
      '#E6BE8A', // Champagne Gold
      '#FFFDD0', // Cream White
    ]
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1 + Math.random() * TUNNEL_RADIUS
      
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100
      
      sz[i] = 0.05 + Math.random() * 0.2
      off[i] = Math.random()
      sp[i] = 0.2 + Math.random() * 0.5
      
      const color = new THREE.Color(palette[Math.floor(Math.random() * palette.length)])
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }
    
    return { positions: pos, sizes: sz, offsets: off, speeds: sp, colors: col }
  }, [])

  useFrame((state) => {
    // Smooth mouse follow
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, (state.mouse.x * 0.5), 0.05)
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, (state.mouse.y * 0.5), 0.05)

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uScrollProgress.value = scrollProgress
      materialRef.current.uniforms.uMouse.value = mouse.current
    }
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={PARTICLE_COUNT} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aOffset" count={PARTICLE_COUNT} array={offsets} itemSize={1} />
        <bufferAttribute attach="attributes-aSpeed" count={PARTICLE_COUNT} array={speeds} itemSize={1} />
        <bufferAttribute attach="attributes-aColor" count={PARTICLE_COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScrollProgress: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) }
        }}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function AmbientGlow() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sparkles count={50} scale={20} size={6} speed={0.3} color="#D4AF37" opacity={0.2} />
    </Float>
  )
}

export function GoldDustTunnel({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <>
      <color attach="background" args={['#080808']} />
      <fog attach="fog" args={['#080808', 5, 45]} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 10]} intensity={20} color="#D4AF37" />
      
      <ShimmerParticles scrollProgress={scrollProgress} />
      <AmbientGlow />
      
      <EffectComposer multisampling={4}>
        <Bloom 
          intensity={1.5} 
          luminanceThreshold={0.2} 
          mipmapBlur 
        />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.3} darkness={1.2} />
      </EffectComposer>
    </>
  )
}

export default GoldDustTunnel
