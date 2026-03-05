'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 15000

const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  
  attribute vec3 aTargetPosition;
  attribute vec3 aRandomOffset;
  attribute float aSize;

  varying vec3 vPosition;
  varying float vOpacity;

  // Curl noise function could be added here for more organic movement, 
  // but for performance we keep it simple with sin/cos
  
  void main() {
    // Initial state: random sphere
    vec3 initialPos = position;
    
    // Vortex phase
    float angle = uTime * 0.2 + aRandomOffset.x * 6.28;
    float dist = 3.0 + aRandomOffset.y * 4.0;
    vec3 vortexPos = vec3(
      cos(angle) * dist,
      sin(angle + uTime * 0.3) * 3.0,
      sin(angle) * dist
    );

    // Final state: Ring shape
    vec3 targetPos = aTargetPosition;

    // Transition logic
    vec3 pos = initialPos;
    
    // Phase 1: Spread to Vortex (0.0 to 0.4)
    float vortexMix = smoothstep(0.0, 0.45, uProgress);
    pos = mix(initialPos, vortexPos, vortexMix);
    
    // Phase 2: Form Ring (0.4 to 0.8)
    // We add some noise based on progress to make it look like particles are being sucked in
    float ringMix = smoothstep(0.45, 0.85, uProgress);
    
    // Non-linear mix for "suction" effect
    float suction = ringMix * ringMix * (3.0 - 2.0 * ringMix);
    pos = mix(pos, targetPos, suction);

    // Add some noise/swirl during transition
    float swirlIntensity = sin(uTime * 2.0 + aRandomOffset.z * 10.0) * 0.5;
    float swirlFade = 4.0 * ringMix * (1.0 - ringMix); // Peak at 0.5
    pos += vec3(swirlIntensity) * swirlFade;

    vPosition = pos;
    
    // Opacity fade
    float fadeOut = smoothstep(0.8, 0.95, uProgress);
    vOpacity = 1.0 - fadeOut;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  varying float vOpacity;

  void main() {
    // Circular particle
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;

    // Gold color
    vec3 gold = vec3(1.0, 0.84, 0.0);
    // Inner glow
    float glow = 1.0 - r * 2.0;
    glow = pow(glow, 1.5);
    
    gl_FragColor = vec4(gold, vOpacity * glow);
  }
`

export const MagicRingEffect = ({ progress }: { progress: number }) => {
    const pointsRef = useRef<THREE.Points>(null!)
    const solidRingRef = useRef<THREE.Group>(null!)
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!)
    
    // Create Torus for target positions
    // We use a regular TorusGeometry to sample points
    const { pos, target, random, sizes } = useMemo(() => {
        const torusGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 100)
        const torusPositions = torusGeo.attributes.position.array
        
        const posArray = new Float32Array(PARTICLE_COUNT * 3)
        const targetArray = new Float32Array(PARTICLE_COUNT * 3)
        const randomArray = new Float32Array(PARTICLE_COUNT * 3)
        const sizesArray = new Float32Array(PARTICLE_COUNT)

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Start positions (random sphere distribution)
            const phi = Math.random() * Math.PI * 2
            const theta = Math.acos(Math.random() * 2 - 1)
            const r = 8 + Math.random() * 8 // Large spread
            
            posArray[i * 3 + 0] = r * Math.sin(theta) * Math.cos(phi)
            posArray[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi)
            posArray[i * 3 + 2] = r * Math.cos(theta)

            // Target positions (sample from torus)
            // Since PARTICLE_COUNT > torus vertices, we loop over them
            const torusVertexCount = torusPositions.length / 3
            const torusIdx = i % torusVertexCount
            
            // Add some jitter to target so they don't align perfectly on grid
            const jitter = 0.05
            targetArray[i * 3 + 0] = torusPositions[torusIdx * 3 + 0] + (Math.random() - 0.5) * jitter
            targetArray[i * 3 + 1] = torusPositions[torusIdx * 3 + 1] + (Math.random() - 0.5) * jitter
            targetArray[i * 3 + 2] = torusPositions[torusIdx * 3 + 2] + (Math.random() - 0.5) * jitter

            // Random attributes for shader animation
            randomArray[i * 3 + 0] = Math.random()
            randomArray[i * 3 + 1] = Math.random()
            randomArray[i * 3 + 2] = Math.random()

            sizesArray[i] = 0.5 + Math.random() * 1.5
        }

        return { 
            pos: posArray, 
            target: targetArray, 
            random: randomArray, 
            sizes: sizesArray 
        }
    }, [])

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uProgress: { value: 0 },
    }), [])

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        
        // Update shader uniforms
        if (pointsRef.current) {
            const material = pointsRef.current.material as THREE.ShaderMaterial
            material.uniforms.uTime.value = time
            material.uniforms.uProgress.value = progress
        }

        // Animate solid ring
        if (solidRingRef.current && materialRef.current) {
            // Show ring when particles start forming it (around 0.7)
            const ringProgress = Math.max(0, (progress - 0.75) * 4.0) // 0 to 1 between 0.75 and 1.0
            
            solidRingRef.current.visible = progress > 0.7
            materialRef.current.opacity = ringProgress
            
            // Rotate ring
            solidRingRef.current.rotation.y = time * 0.1 + (progress * Math.PI * 2) // Spin faster with scroll
            solidRingRef.current.rotation.x = Math.sin(time * 0.2) * 0.1
        }
    })

    return (
        <group>
            {/* Particles */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={PARTICLE_COUNT}
                        array={pos}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-aTargetPosition"
                        count={PARTICLE_COUNT}
                        array={target}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-aRandomOffset"
                        count={PARTICLE_COUNT}
                        array={random}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-aSize"
                        count={PARTICLE_COUNT}
                        array={sizes}
                        itemSize={1}
                    />
                </bufferGeometry>
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Solid Ring */}
            <group ref={solidRingRef} visible={false}>
                <mesh>
                    <torusGeometry args={[1.5, 0.2, 32, 100]} />
                    <meshPhysicalMaterial
                        ref={materialRef}
                        color="#FFD700"
                        emissive="#D4AF37"
                        emissiveIntensity={0.2}
                        metalness={1.0}
                        roughness={0.15}
                        clearcoat={1.0}
                        clearcoatRoughness={0.1}
                        transparent
                        opacity={0}
                    />
                </mesh>
            </group>
        </group>
    )
}
