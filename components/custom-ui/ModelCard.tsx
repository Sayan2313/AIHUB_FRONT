"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { Model } from "@/types/models";
import { useRef, MouseEvent } from "react";
import { Zap, ArrowRight, Construction, Sparkles, Activity } from "lucide-react";

// Only Phi is live — all others are under development
const LIVE_MODELS = ["Phi","Peak"];

export default function ModelCard({
    name,
    summary,
    description,
    capabilities,
    latency,
    price,
}: Model) {
    const isLive = LIVE_MODELS.some(
        (m) => m.toLowerCase() === name.toLowerCase()
    );
    const cardRef = useRef<HTMLDivElement>(null);

    // ─── 3D Tilt (wider range + real depth via translateZ layers) ───
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springCfg = { stiffness: 180, damping: 18, mass: 0.6 };

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springCfg);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springCfg);

    const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
    const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

    // Layers move at different translateZ to sell depth as the card tilts
    const liftIcon = useSpring(useMotionValue(0), springCfg);
    const liftCTA = useSpring(useMotionValue(0), springCfg);

    const handleMouseMove = (e: MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
        liftIcon.set(1);
        liftCTA.set(1);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        liftIcon.set(0);
        liftCTA.set(0);
    };

    const getLatencyColor = (lat: string) => {
        switch (lat) {
            case "Low":
                return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
            case "Medium":
                return "bg-amber-500/15 text-amber-400 border-amber-500/20";
            case "High":
                return "bg-red-500/15 text-red-400 border-red-500/20";
        }
    };
    const getLatencyDotColor = (lat: string) => {
        switch (lat) {
            case "Low":
                return "bg-emerald-400";
            case "Medium":
                return "bg-amber-400";
            case "High":
                return "bg-red-400";
        }
    };

    // Accent colours per-card based on model name hash
    const accentHue = name
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

    return (
        <div style={{ perspective: 1200 }} className="m-4">
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, y: 40, rotateX: 0 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -6 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] border bg-white/[0.035] backdrop-blur-2xl p-6 shadow-2xl transition-[border-color,box-shadow] duration-500 ${isLive
                        ? "border-white/8 hover:border-violet-500/40 hover:shadow-[0_25px_70px_-15px_rgba(139,92,246,.35)]"
                        : "border-white/6 opacity-85 hover:opacity-100 hover:border-amber-500/25 hover:shadow-[0_25px_70px_-15px_rgba(245,158,11,.2)]"
                    }`}
            >
                {/* ── Ambient depth shadow beneath the card (grows on hover) ── */}
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -inset-4 -z-10 rounded-[36px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                    style={{
                        background: `radial-gradient(60% 60% at 50% 100%, hsl(${accentHue}, 70%, 50%, 0.25), transparent 70%)`,
                    }}
                />

                {/* ── Cursor-tracking glare, sits slightly above the surface ── */}
                <motion.div
                    className="pointer-events-none absolute inset-0 z-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                        transform: "translateZ(1px)",
                        background: useTransform(
                            [glareX, glareY],
                            ([gx, gy]) =>
                                `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,.08) 0%, transparent 55%)`
                        ),
                    }}
                />

                {/* ── Fine grain border sheen ── */}
                <div
                    className="pointer-events-none absolute inset-0 z-0 rounded-[28px] opacity-40"
                    style={{
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 40px hsl(${accentHue}, 60%, 30%, 0.06)`,
                    }}
                />

                {/* ── Top gradient accent line ── */}
                <div
                    className="absolute top-0 left-6 right-6 h-px opacity-60"
                    style={{
                        background: `linear-gradient(90deg, transparent, hsl(${accentHue}, 70%, 60%), transparent)`,
                    }}
                />

                {/* ── Status Badge (top-right), floated forward in Z ── */}
                <motion.div
                    className="absolute top-4 right-4 z-20"
                    style={{ transform: "translateZ(40px)" }}
                >
                    {isLive ? (
                        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 shadow-[0_4px_14px_-4px_rgba(16,185,129,.5)]">
                            <motion.span
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                            />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                                Live
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1">
                            <Construction className="size-3 text-amber-400" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                                Coming Soon
                            </span>
                        </div>
                    )}
                </motion.div>

                {/* ── Model Icon + Name, floats forward most on hover ── */}
                <motion.div
                    className="relative z-10 flex items-start gap-4"
                    style={{ transform: "translateZ(30px)" }}
                >
                    <motion.div
                        whileHover={{ rotate: -8, scale: 1.12 }}
                        transition={{ type: "spring", stiffness: 350, damping: 15 }}
                        className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, hsl(${accentHue}, 60%, 22%), hsl(${accentHue}, 45%, 10%))`,
                            border: `1px solid hsl(${accentHue}, 50%, 35%, 0.4)`,
                            boxShadow: `0 12px 24px -8px hsl(${accentHue}, 60%, 20%, 0.6)`,
                        }}
                    >
                        <Image
                            src={`${name}.svg` || "AIHUB.svg"}
                            alt={`${name} logo`}
                            width={40}
                            height={40}
                            className="object-contain drop-shadow-lg"
                            onError={(e) => {
                                e.currentTarget.src = "/AIHUB.svg";
                            }}
                        />
                        {/* Icon glow */}
                        <div
                            className="absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                            style={{ background: `hsl(${accentHue}, 70%, 50%)` }}
                        />
                        {/* Rim light */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                    </motion.div>

                    <div className="flex-1 min-w-0 pr-16 pt-0.5">
                        <p
                            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold"
                            style={{ color: `hsl(${accentHue}, 60%, 68%)` }}
                        >
                            <Activity className="size-2.5" />
                            Model
                        </p>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-white truncate">
                            {name}
                        </h2>
                    </div>
                </motion.div>

                {/* ── Summary ── */}
                <p className="relative z-10 mt-4 text-sm font-medium text-white/90 leading-snug">
                    {summary}
                </p>

                {/* ── Description ── */}
                <p className="relative z-10 mt-2 text-[13px] flex-1 leading-relaxed text-neutral-400">
                    {description}
                </p>

                {/* ── Capabilities, slight forward float ── */}
                <div
                    className="relative z-10 mt-5 flex flex-wrap gap-1.5"
                    style={{ transform: "translateZ(15px)" }}
                >
                    {capabilities.map((cap) => (
                        <span
                            key={cap}
                            className="rounded-lg border border-white/[0.07] bg-white/4.5 px-2.5 py-1 text-[11px] font-medium text-neutral-300 shadow-sm transition-all duration-200 group-hover:border-white/[0.12] group-hover:bg-white/[0.06] group-hover:text-white"
                        >
                            {cap}
                        </span>
                    ))}
                </div>

                {/* ── Divider ── */}
                <div className="relative z-10 mt-5 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

                {/* ── Bottom Row ── */}
                <div
                    className="relative z-10 mt-4 flex items-center justify-between"
                    style={{ transform: "translateZ(25px)" }}
                >
                    {/* Latency + Price */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <Zap className="size-3 text-neutral-500" />
                            <div className="flex items-center gap-1.5">
                                <motion.span
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className={`h-1.5 w-1.5 rounded-full ${getLatencyDotColor(latency)}`}
                                />
                                <span
                                    className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${getLatencyColor(latency)}`}
                                >
                                    {latency}
                                </span>
                            </div>
                        </div>
                        <span className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-400">
                            ✦ Free
                        </span>
                    </div>

                    {/* CTA, pops forward on hover */}
                    {isLive ? (
                        <Link href={`/models/${name}`}>
                            <motion.button
                                whileHover={{ scale: 1.06, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="group/btn relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white overflow-hidden shadow-[0_8px_20px_-6px_rgba(124,58,237,.6)]"
                                style={{
                                    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                                }}
                            >
                                <div
                                    className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)",
                                        backgroundSize: "200% 100%",
                                        animation: "shimmer 2s infinite",
                                    }}
                                />
                                <Sparkles className="size-3" />
                                Try Model
                                <ArrowRight className="size-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                            </motion.button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-1.5 rounded-xl border border-white/6 bg-white/3 px-4 py-2 text-xs font-medium text-neutral-500 cursor-not-allowed">
                            <Construction className="size-3" />
                            In Development
                        </div>
                    )}
                </div>

                {/* ── Under-development overlay tint ── */}
                {!isLive && (
                    <div className="pointer-events-none absolute inset-0 z-1 rounded-[28px] bg-black/20" />
                )}
            </motion.div>
        </div>
    );
}