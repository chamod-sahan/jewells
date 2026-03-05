'use client'

import React, { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export const CustomCursor = () => {
    const [isHovered, setIsHovered] = useState(false)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isClickable = target.closest('button, a, [role="button"], .group')
            setIsHovered(!!isClickable)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseover', handleMouseOver)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseover', handleMouseOver)
        }
    }, [mouseX, mouseY])

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{ x, y }}
            >
                {/* Main Outer Ring */}
                <motion.div
                    animate={{
                        width: isHovered ? 80 : 32,
                        height: isHovered ? 80 : 32,
                        borderColor: isHovered ? 'rgba(212, 175, 55, 0.8)' : 'rgba(212, 175, 55, 0.2)',
                        borderWidth: isHovered ? 1 : 1,
                        rotate: isHovered ? 90 : 0
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 150 }}
                    className="absolute border rounded-full border-[#D4AF37] flex items-center justify-center"
                >
                    {/* Inner Diamond/Square shape on hover */}
                    <motion.div
                        initial={false}
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            scale: isHovered ? 1 : 0.5,
                            rotate: 45
                        }}
                        className="w-2 h-2 border border-[#D4AF37]"
                    />
                </motion.div>

                {/* Center Point */}
                <motion.div
                    animate={{
                        scale: isHovered ? 0.5 : 1,
                        opacity: isHovered ? 0.3 : 1
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]"
                />

                {/* Hover Label */}
                {isHovered && (
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-12 text-[7px] tracking-[0.4em] text-[#D4AF37] uppercase whitespace-nowrap"
                    >
                        Inquire
                    </motion.span>
                )}
            </motion.div>

            <style jsx global>{`
                body, a, button, [role="button"] {
                    cursor: none !important;
                }
            `}</style>
        </>
    )
}
