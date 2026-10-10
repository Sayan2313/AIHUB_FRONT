"use client"

import {motion} from "framer-motion"
import {Sparkles} from "lucide-react"

const technologies = [
    {name: "Next.js 15", color: "text-white"},
    {name: "Three.js", color: "text-amber-400"},
    {name: "Tailwind CSS", color: "text-cyan-400"},
    {name: "Framer Motion", color: "text-pink-500"},
    {name: "TypeScript", color: "text-blue-500"},
    {name: "Shadcn UI", color: "text-purple-400"},
]

// Duplicate the array to ensure seamless infinite looping with zero clipping blank space
const duplicatedTech = [...technologies, ...technologies, ...technologies]

export default function TechUsedSection() {
    return (
        <section className="w-full border-t border-border/30 bg-transparent py-6 sm:py-8 relative overflow-hidden">
            {/* Ambient Left/Right Edge Fade Mask (Blends ticker seamlessly into screen boundaries) */}
            <div className="mx-auto max-w-7xl px-4 mb-4 flex items-center justify-center sm:justify-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse "/>
                <span className="text-xs font-semibold tracking-wider uppercase">
                    Technology Used
                </span>
            </div>

            {/* Continuous Marquee Sliding Train Track Container */}
            <div className="flex overflow-hidden w-full select-none">
                <motion.div
                    className="flex gap-8 sm:gap-12 pr-8 sm:pr-12 whitespace-nowrap min-w-full justify-around items-center"
                    animate={{x: [0, "-33.33%"]}}
                    transition={{
                        ease: "linear",
                        duration: 10, // Change this number to speed up or slow down the ticker loop speed
                        repeat: Infinity,
                    }}
                >
                    {duplicatedTech.map((tech, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-3 bg-muted/10 border border-border/40 backdrop-blur-sm px-4 py-2 rounded-xl transition-colors hover:border-purple-500/30 hover:bg-muted/20"
                        >
                            {/* Small decorative dot */}
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500/60"/>
                            <span className={`text-sm sm:text-base font-bold tracking-tight ${tech.color}`}>
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}