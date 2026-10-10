"use client"

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Cpu, Zap, Shield, Globe, ChevronRight } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";

/* ──────────────────────────────────────────────
   Animated counter hook
   ────────────────────────────────────────────── */
function useCounter(target: number, duration = 2000, delay = 0) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const timeout = setTimeout(() => {
            let start = 0;
            const step = target / (duration / 16);
            const interval = setInterval(() => {
                start += step;
                if (start >= target) {
                    setCount(target);
                    clearInterval(interval);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timeout);
    }, [target, duration, delay]);
    return count;
}

/* ──────────────────────────────────────────────
   Floating particle component
   ────────────────────────────────────────────── */
function FloatingParticle({ delay, size, x, y, color }: { delay: number; size: number; x: string; y: string; color: string }) {
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
                width: size,
                height: size,
                left: x,
                top: y,
                background: color,
                filter: `blur(${size > 4 ? 1 : 0}px)`,
            }}
            animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.3, 1],
            }}
            transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
            }}
        />
    );
}

/* ──────────────────────────────────────────────
   Orbital ring component
   ────────────────────────────────────────────── */
function OrbitalRing({ size, duration, opacity, color }: { size: number; duration: number; opacity: number; color: string }) {
    return (
        <motion.div
            className="absolute rounded-full border pointer-events-none"
            style={{
                width: size,
                height: size,
                borderColor: color,
                opacity,
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
        />
    );
}

/* ──────────────────────────────────────────────
   Typewriter text for the subtitle
   ────────────────────────────────────────────── */
const subtitlePhrases = [
    "ChatGPT, Gemini, Claude & more.",
    "One hub. Infinite possibilities.",
    "Switch models. Instantly.",
];

function TypewriterText() {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const phrase = subtitlePhrases[phraseIndex];
        let timeout: NodeJS.Timeout;

        if (!isDeleting && charIndex < phrase.length) {
            timeout = setTimeout(() => setCharIndex(c => c + 1), 50);
        } else if (!isDeleting && charIndex === phrase.length) {
            timeout = setTimeout(() => setIsDeleting(true), 2200);
        } else if (isDeleting && charIndex > 0) {
            timeout = setTimeout(() => setCharIndex(c => c - 1), 30);
        } else if (isDeleting && charIndex === 0) {
            setIsDeleting(false);
            setPhraseIndex((phraseIndex + 1) % subtitlePhrases.length);
        }

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, phraseIndex]);

    return (
        <span className="inline-flex items-center">
            <span>{subtitlePhrases[phraseIndex].substring(0, charIndex)}</span>
            <motion.span
                className="inline-block w-[2px] h-5 bg-violet-400 ml-0.5"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
            />
        </span>
    );
}

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */
const stats = [
    { label: "AI Models", value: 50, suffix: "+" },
    { label: "API Calls/Day", value: 10, suffix: "M+" },
    { label: "Uptime", value: 99.9, suffix: "%", isDecimal: true },
];

const features = [
    { icon: Cpu, label: "Multi-Model Access", color: "text-violet-400" },
    { icon: Zap, label: "Lightning Fast", color: "text-amber-400" },
    { icon: Shield, label: "Enterprise Secure", color: "text-emerald-400" },
    { icon: Globe, label: "Global CDN", color: "text-sky-400" },
];

/* ──────────────────────────────────────────────
   Stagger animation variants
   ────────────────────────────────────────────── */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
};

/* ══════════════════════════════════════════════
   HERO COMPONENT
   ══════════════════════════════════════════════ */
export default function Hero({ children }: { children?: ReactNode }) {
    const modelCount = useCounter(50, 1800, 800);
    const apiCount = useCounter(10, 1800, 1000);

    return (
        <section className="hero-section relative flex min-h-[calc(100dvh-4rem)] w-full items-center overflow-hidden pt-20">

            {/* ── Ambient background effects ── */}
            <div className="pointer-events-none absolute inset-0 z-0">
                {/* Gradient orbs */}
                <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-violet-600/[0.12] blur-[120px]" />
                <div className="absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-indigo-600/[0.10] blur-[100px]" />
                <div className="absolute top-1/2 left-1/3 h-[300px] w-[300px] rounded-full bg-fuchsia-600/[0.06] blur-[80px]" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)",
                        backgroundSize: "64px 64px",
                    }}
                />

                {/* Scan line */}
                <motion.div
                    className="absolute left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Floating particles */}
                <FloatingParticle delay={0} size={3} x="10%" y="20%" color="rgba(139,92,246,0.6)" />
                <FloatingParticle delay={0.5} size={2} x="25%" y="60%" color="rgba(59,130,246,0.5)" />
                <FloatingParticle delay={1} size={4} x="15%" y="80%" color="rgba(139,92,246,0.4)" />
                <FloatingParticle delay={1.5} size={2} x="40%" y="15%" color="rgba(236,72,153,0.4)" />
                <FloatingParticle delay={2} size={3} x="35%" y="45%" color="rgba(59,130,246,0.5)" />
                <FloatingParticle delay={0.8} size={2} x="5%" y="40%" color="rgba(139,92,246,0.3)" />
            </div>

            {/* ── Main content grid — Left: text / Right: 3D ── */}
            <div className="relative z-20 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-2 lg:gap-0">

                {/* ─── LEFT: Text content ─── */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-start gap-6 py-12 lg:py-4 lg:pr-8"
                >
                    {/* Eyebrow badge */}
                    <motion.div variants={itemVariants}>
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-4 py-1.5 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-widest text-violet-300">
                                Now in Public Beta
                            </span>
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                            <span className="block text-white drop-shadow-[0_2px_30px_rgba(0,0,0,.5)]">
                                All Your AI Models
                            </span>
                            <span className="hero-gradient-text block bg-clip-text text-transparent">
                                One Powerful Hub
                            </span>
                        </h1>
                    </motion.div>

                    {/* Subtitle with typewriter */}
                    <motion.div variants={itemVariants} className="max-w-md">
                        <p className="text-base font-medium leading-relaxed text-neutral-400 sm:text-lg">
                            Access the world&apos;s best AI models through a single, unified interface.{" "}
                            <span className="text-neutral-200">
                                <TypewriterText />
                            </span>
                        </p>
                    </motion.div>

                    {/* Feature pills */}
                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
                        {features.map((feat) => (
                            <motion.span
                                key={feat.label}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-sm transition-colors hover:border-white/[0.12] hover:bg-white/[0.06]"
                            >
                                <feat.icon className={`size-3.5 ${feat.color}`} />
                                {feat.label}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* CTA buttons */}
                    <motion.div variants={itemVariants} className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                        <Link href="/models" className="group">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="hero-cta-primary relative flex items-center justify-center gap-2.5 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-[0_20px_50px_-12px_rgba(124,58,237,.6)]"
                            >
                                <span
                                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    style={{
                                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)",
                                        backgroundSize: "200% 100%",
                                        animation: "shimmer 2s infinite",
                                    }}
                                />
                                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
                                <Sparkles className="size-4" />
                                Explore Models
                                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </motion.button>
                        </Link>

                        <Link href="/contact" className="group">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-neutral-300 backdrop-blur-sm transition-all hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white"
                            >
                                Learn More
                                <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div variants={itemVariants} className="mt-2 flex items-center gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col">
                                <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                    {stat.isDecimal ? "99.9" : (stat.label === "AI Models" ? modelCount : apiCount)}
                                    <span className="hero-gradient-text bg-clip-text text-transparent">
                                        {stat.suffix}
                                    </span>
                                </span>
                                <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* ─── RIGHT: 3D scene (passed as children) ─── */}
                <div className="relative flex items-center justify-center lg:h-[calc(100dvh-4rem)]">
                    {/* Orbital rings */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <OrbitalRing size={320} duration={20} opacity={0.08} color="rgba(139,92,246,0.4)" />
                        <OrbitalRing size={480} duration={30} opacity={0.05} color="rgba(59,130,246,0.3)" />
                        <OrbitalRing size={600} duration={40} opacity={0.03} color="rgba(236,72,153,0.2)" />
                    </div>

                    {/* Center glow */}
                    <div className="pointer-events-none absolute h-[350px] w-[350px] rounded-full bg-violet-600/[0.15] blur-[80px]" />

                    {/* 3D Spline scene — rendered via Server Component children */}
                    <div className="relative h-[400px] w-full sm:h-[500px] lg:h-full">
                        {children}
                    </div>

                </div>
            </div>

            {/* ── Bottom scroll indicator ── */}
            <motion.div
                className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <motion.div
                    className="flex flex-col items-center gap-2"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-600">Scroll</span>
                    <div className="h-8 w-[1.5px] rounded-full bg-gradient-to-b from-violet-500/60 to-transparent" />
                </motion.div>
            </motion.div>
        </section>
    )
}
