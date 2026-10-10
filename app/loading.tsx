'use client';

import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

            {/* Central Core Visualizer */}
            <div className="relative flex items-center justify-center">
                {/* Outer pulsing ring */}
                <motion.div
                    animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.3, 0.7, 0.3],
                        rotate: 360,
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute h-32 w-32 rounded-full border border-dashed border-indigo-500/40"
                />

                {/* Counter-rotating gradient aura */}
                <motion.div
                    animate={{
                        rotate: -360,
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute h-24 w-24 rounded-full bg-linear-to-tr from-indigo-500/20 via-violet-500/20 to-cyan-500/20 blur-md"
                />

                {/* Center glowing core with icon */}
                <motion.div
                    animate={{
                        boxShadow: [
                            '0 0 20px rgba(99, 102, 241, 0.3)',
                            '0 0 40px rgba(139, 92, 246, 0.6)',
                            '0 0 20px rgba(99, 102, 241, 0.3)',
                        ],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-xl shadow-inner"
                >
                    <Bot className="h-8 w-8 text-indigo-400" />
                </motion.div>
            </div>

            {/* Animated Text & Status */}
            <div className="mt-8 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-sm font-medium tracking-wider text-zinc-300">
                    <Sparkles className="h-4 w-4 animate-pulse text-indigo-400" />
                    <motion.span
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        Loading....
                    </motion.span>
                </div>

                {/* Subtle dynamic progress track */}
                <div className="h-1 w-48 overflow-hidden rounded-full bg-zinc-900 border border-zinc-800">
                    <motion.div
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="h-full w-1/2 rounded-full bg-linear-to-r from-transparent via-indigo-500 to-transparent"
                    />
                </div>
            </div>
        </div>
    );
}