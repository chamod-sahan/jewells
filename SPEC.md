# JWELLS Cinematic Scroll Experience - Specification

## Project Overview
- **Project Name**: JWELLS Cinematic Scroll
- **Type**: Immersive 3D scroll-based website experience
- **Core Functionality**: Scroll-controlled camera traveling through a golden particle tunnel that transforms into a jewellery ring reveal
- **Target Users**: Luxury jewellery consumers seeking premium digital experience

## Technical Stack
- Next.js 16 with React 19
- Three.js via React Three Fiber
- GSAP ScrollTrigger for scroll animations
- Lenis for smooth scrolling
- Custom GLSL shaders for particle effects
- Post-processing (Bloom, Noise, Vignette)

## UI/UX Specification

### Layout Structure
- **Full viewport canvas**: 100vw x 100vh fixed position
- **Scroll container**: Tall scrollable area (500vh) for scroll travel
- **Overlay content**: HTML text overlays at key scroll positions

### Visual Design

#### Color Palette
- **Primary Gold**: `#D4AF37` (Metallic gold)
- **Gold Highlight**: `#FFD700` (Bright gold)
- **Gold Deep**: `#B8860B` (Dark goldenrod)
- **Background**: `#050505` (Near black)
- **Text White**: `#FFFFFF`
- **Gold Glow**: `#FFA040` (Warm gold light)

#### Typography
- **Brand Name**: "JWELLS" - Playfair Display, 8rem, letter-spacing: 0.5em
- **Tagline**: Uppercase, tracking 1.2em, gold color

#### Visual Effects
- **Bloom**: intensity 2.0, threshold 0.3, smoothing 0.9
- **Film Grain**: opacity 0.04
- **Vignette**: offset 0.15, darkness 1.4
- **Particle glow**: additive blending

### Components

#### 1. Golden Particle Tunnel
- **Particle count**: 15,000 particles
- **Shape**: Cylindrical tunnel, radius 8, length 100
- **Movement**: 
  - Slow forward drift (0.001 units/frame)
  - Spiral rotation (0.002 rad/frame)
  - Sine wave distortion for twist effect
- **Appearance**: 
  - Size: 0.02-0.08 random
  - Color: Gold gradient (#D4AF37 to #FFD700)
  - Opacity: 0.3-0.8 with distance fade

#### 2. Tornado Vortex
- **Position**: Start of tunnel
- **Behavior**:
  - Particles rotate around center
  - Pull toward center (radius decreases over time)
  - Vertical oscillation
- **Spiral arms**: 2-3 visible arms

#### 3. Ring Reveal
- **Geometry**: Torus geometry (radius 2, tube 0.3)
- **Material**: MeshStandardMaterial, metalness 1.0, roughness 0.1
- **Color**: Gold #D4AF37
- **Animation**: 
  - Scale from 0 to 1 over scroll progress
  - Rotation speed increases with scroll
  - Position moves from tunnel end toward camera

#### 4. Camera Motion
- **Start position**: (0, 0, 50)
- **End position**: (0, 0, -20)
- **Travel distance**: 70 units
- **Sway**: Sinusoidal X/Y movement (amplitude 0.3, frequency 0.5)
- **Look-at**: Always slightly ahead of position

### Scroll Journey

#### Phase 1: Entry (0-20%)
- Camera at tunnel entrance
- Particles form visible tornado vortex
- Subtle gold glow intensifies

#### Phase 2: Travel (20-70%)
- Camera moves forward through tunnel
- Particles swirl past camera
- Speed increases gradually
- Tornado disperses into tunnel particles

#### Phase 3: Assembly (70-90%)
- Particles begin converging
- Ring shape becomes visible in distance
- Particles swirl faster toward center

#### Phase 4: Reveal (90-100%)
- Full ring visible
- Camera approaches ring
- "JWELLS" text fades in
- Bloom intensifies

### Post-Processing Stack
1. **UnrealBloomPass**: strength 2.0, radius 0.8, threshold 0.3
2. **FilmPass**: noise intensity 0.04
3. **VignetteShader**: eskil false, offset 0.15, darkness 1.4

### Performance Targets
- **FPS**: 60fps target
- **Particle count**: 15,000 (GPU instanced)
- **Draw calls**: < 10

## Acceptance Criteria

1. **Scroll Response**: Camera moves smoothly through tunnel on scroll
2. **Particle Animation**: Particles rotate, drift, and create tornado effect
3. **Ring Reveal**: Ring forms from particles at scroll end
4. **Text Display**: "JWELLS" appears at completion
5. **Visual Quality**: Bloom creates golden glow effect
6. **Smoothness**: Lenis provides smooth scroll feel
7. **Performance**: Maintains 60fps on modern hardware

## File Structure
```
src/
├── app/
│   └── page.tsx              (Main page with scroll sections)
├── components/
│   ├── Experience.tsx        (Background 3D scene)
│   ├── ScrollTunnel.tsx     (NEW: Particle tunnel component)
│   └── ScrollOverlay.tsx     (NEW: Text overlays)
├── styles/
│   └── globals.css           (Global styles)
public/
└── (existing images)
```
