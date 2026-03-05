'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

const PARTICLE_COUNT = 2000000
const TUNNEL_LENGTH = 300.0
const TUNNEL_RADIUS = 35.0
const RING_RADIUS = 2.5
const RING_TUBE = 0.4

const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uTornadoIntensity;
  uniform float uAssemblyProgress;
  
  attribute float aSize;
  attribute float aOffset;
  attribute float aSpeed;
  attribute vec3 aRingPosition;
  
  varying float vAlpha;
  varying float vAssembly;
  
  #define PI 3.14159265359
  #define TUNNEL_LEN ${TUNNEL_LENGTH.toFixed(1)}
  
  void main() {
    vec3 pos = position;
    float zOffset = pos.z;

    // Tornado Factor
    float tornadoFactor = uTornadoIntensity * (1.0 - smoothstep(-50.0, 100.0, zOffset));
    
    // High-velocity spiral
    float scrollRotation = uScrollProgress * PI * 4.0;
    float tornadoSpin = uTime * 0.4 + (tornadoFactor * 6.0); 
    float spiralAngle = zOffset * 0.04 + tornadoSpin + (scrollRotation * (0.5 + tornadoFactor * 0.5));
    
    float radius = length(pos.xy);
    float angle = atan(pos.y, pos.x);
    
    angle += spiralAngle + aOffset * PI * 2.0;
    
    // Tunnel structure - loosened for better "tunnel" feel
    float targetRadius = mix(radius, 15.0 + aOffset * 15.0, tornadoFactor * 0.6);
    
    pos.x = cos(angle) * targetRadius;
    pos.y = sin(angle) * targetRadius;
    
    // Axial movement - fix: use the defined TUNNEL_LEN constant
    float axialSpeed = (1.0 + tornadoFactor * 3.0) * uTime * 5.0;
    pos.z = mod(axialSpeed + aOffset * TUNNEL_LEN, TUNNEL_LEN) - (TUNNEL_LEN * 0.5);
    
    // Chaotic turbulence
    float turbulence = sin(uTime * 5.0 + aOffset * 10.0) * tornadoFactor * 0.5;
    pos.xy += turbulence;

    // Ring Assembly
    vec3 assemblyTarget = aRingPosition;
    float assemblyFactor = uAssemblyProgress;
    
    if (assemblyFactor > 0.0) {
      float t = pow(assemblyFactor, 3.5); 
      float currentAngle = atan(pos.y, pos.x);
      float targetAng = atan(assemblyTarget.y, assemblyTarget.x);
      float targetR = length(assemblyTarget.xy);
      
      float finalAngle = mix(currentAngle, targetAng, t);
      float finalRadius = mix(targetRadius, targetR, t);
      
      pos.x = cos(finalAngle) * finalRadius;
      pos.y = sin(finalAngle) * finalRadius;
      pos.z = mix(pos.z, assemblyTarget.z, t);
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Distance and Visibility
    float distanceFade = 1.0 - smoothstep(50.0, 150.0, -mvPosition.z);
    float assemblyFade = 1.0 - smoothstep(0.85, 0.99, assemblyFactor);
    
    vAlpha = distanceFade * (0.2 + tornadoFactor * 0.3) * assemblyFade;
    vAssembly = assemblyFactor;
    
    gl_PointSize = aSize * (450.0 / -mvPosition.z) * (1.1 + tornadoFactor * 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  
  varying float vAlpha;
  varying float vAssembly;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5 || vAlpha < 0.01) discard;
    
    float glow = pow(1.0 - dist * 2.0, 3.0);
    vec3 color = mix(uColor1, uColor2, vAssembly);
    
    float core = pow(1.0 - dist * 2.0, 12.0) * 1.5;
    
    gl_FragColor = vec4(color + core, vAlpha * glow);
  }
`

function ParticleTunnel({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const { positions, sizes, offsets, speeds, ringPositions } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const sz = new Float32Array(PARTICLE_COUNT)
    const off = new Float32Array(PARTICLE_COUNT)
    const sp = new Float32Array(PARTICLE_COUNT)
    const ringPos = new Float32Array(PARTICLE_COUNT * 3)

    const tempTorus = new THREE.TorusGeometry(RING_RADIUS, RING_TUBE, 48, 100)
    const torusAttr = tempTorus.attributes.position.array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      // Using sqrt to push particles to the outer edge of the tunnel
      const radiusRange = Math.sqrt(Math.random())
      const radius = 12 + radiusRange * TUNNEL_RADIUS
      const z = (Math.random() - 0.5) * TUNNEL_LENGTH

      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = z

      const torusIdx = i % (torusAttr.length / 3)
      ringPos[i * 3] = torusAttr[torusIdx * 3]
      ringPos[i * 3 + 1] = torusAttr[torusIdx * 3 + 1]
      ringPos[i * 3 + 2] = torusAttr[torusIdx * 3 + 2]

      sz[i] = 0.04 + Math.random() * 0.15
      off[i] = Math.random()
      sp[i] = 1.0 + Math.random() * 2.0
    }

    return { positions: pos, sizes: sz, offsets: off, speeds: sp, ringPositions: ringPos }
  }, [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uScrollProgress.value = scrollProgress

      const tornado = Math.max(0, 1 - scrollProgress * 2.5)
      materialRef.current.uniforms.uTornadoIntensity.value = tornado

      const assembly = Math.max(0, (scrollProgress - 0.45) / 0.45)
      materialRef.current.uniforms.uAssemblyProgress.value = Math.min(1, assembly)
    }
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uTornadoIntensity: { value: 1.0 },
    uAssemblyProgress: { value: 0 },
    uColor1: { value: new THREE.Color('#D4AF37') }, // Metallic Gold
    uColor2: { value: new THREE.Color('#FFD700') }, // Golden Yellow
  }), [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={PARTICLE_COUNT} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aOffset" count={PARTICLE_COUNT} array={offsets} itemSize={1} />
        <bufferAttribute attach="attributes-aSpeed" count={PARTICLE_COUNT} array={speeds} itemSize={1} />
        <bufferAttribute attach="attributes-aRingPosition" count={PARTICLE_COUNT} array={ringPositions} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function GoldRing({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null!)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!)

  useFrame((state) => {
    if (groupRef.current) {
      // Sync mesh appearance with assembly progress (start at 0.6, full by 0.9)
      const assemblyProgress = Math.max(0, (scrollProgress - 0.6) / 0.3)
      const scale = Math.min(1, assemblyProgress)

      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, scale, 0.1))

      if (materialRef.current) {
        materialRef.current.opacity = Math.min(1, assemblyProgress)
      }

      groupRef.current.position.x = 0
      const creationZ = -30 + (scrollProgress * 35)
      const backgroundZ = 5
      const targetZ = scrollProgress < 0.9 ? creationZ : backgroundZ

      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05)
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15

      if (scrollProgress < 0.9) {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.4 + scrollProgress * 12
        groupRef.current.rotation.x = THREE.MathUtils.lerp(Math.PI, Math.PI * 0.15, scrollProgress)
      } else {
        groupRef.current.rotation.y += 0.004
        const targetX = Math.PI * 0.15
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05)
      }
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef} scale={0}>
      <mesh castShadow>
        <torusGeometry args={[RING_RADIUS, RING_TUBE, 64, 128]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#FFD700"
          emissive="#D4AF37"
          emissiveIntensity={0.1}
          metalness={1.0}
          roughness={0.05}
          envMapIntensity={4}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={1}
          transparent
          opacity={0}
        />
      </mesh>
      <pointLight position={[4, 0, 2]} intensity={20} color="#FFFDE7" distance={10} />
      <pointLight position={[-4, 0, 2]} intensity={20} color="#FFFDE7" distance={10} />
    </group>
  )
}

function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()
  const currentTargetZ = useRef(75)

  useFrame(() => {
    const targetZ = scrollProgress < 0.85 ? 75 - scrollProgress * 100 : 12
    currentTargetZ.current = THREE.MathUtils.lerp(currentTargetZ.current, targetZ, 0.05)

    camera.position.z = currentTargetZ.current
    camera.position.x = Math.sin(scrollProgress * Math.PI * 2) * 1.5 * (1 - scrollProgress * 0.9)
    camera.position.y = Math.cos(scrollProgress * Math.PI * 1.5) * 0.8 * (1 - scrollProgress * 0.9)

    camera.lookAt(0, 0, -10)
  })

  return null
}

export function ScrollTunnel({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <color attach="background" args={['#010101']} />
      <fog attach="fog" args={['#010101', 40, 150]} />

      <Environment preset="city" />
      <ambientLight intensity={0.25} />

      <CameraRig scrollProgress={scrollProgress} />
      <ParticleTunnel scrollProgress={scrollProgress} />
      <GoldRing scrollProgress={scrollProgress} />

      <EffectComposer multisampling={4}>
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.2}
          mipmapBlur
        />
        <Noise opacity={0.08} />
        <Vignette eskil={false} offset={0.2} darkness={2.2} />
      </EffectComposer>
    </>
  )
}

export default ScrollTunnel
