"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Sparkles, ArrowRight, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/models", label: "Models" },
    { href: "/contact", label: "Contact" },
]

export default function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [scrolled, setScrolled] = useState(false)
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)
    const { user, isLoading, logout } = useAuth()

    const checkIsActive = (href: string) => {
        return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
    }

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-0 z-50 w-full flex justify-center px-4 pt-3"
        >
            {/* Outer wrapper — animated gradient border */}
            <motion.div
                className="relative w-full max-w-4xl rounded-2xl p-[1px]"
                animate={{
                    boxShadow: scrolled
                        ? "0 8px 32px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.06)"
                        : "0 4px 20px rgba(0,0,0,.25), 0 0 0 1px rgba(255,255,255,.04)",
                }}
                transition={{ duration: 0.4 }}
            >
                {/* Animated gradient border shimmer */}
                <div
                    className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
                    aria-hidden
                >
                    <div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(139,92,246,.4), rgba(59,130,246,.3), rgba(236,72,153,.3), rgba(139,92,246,.4))",
                            backgroundSize: "300% 300%",
                            animation: "gradient-shift 6s ease infinite",
                        }}
                    />
                </div>

                {/* Glass inner */}
                <nav
                    className={cn(
                        "relative flex h-14 items-center justify-between rounded-2xl px-5 transition-all duration-500",
                        scrolled
                            ? "bg-black/70 backdrop-blur-xl"
                            : "bg-black/50 backdrop-blur-md"
                    )}
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Link
                            href="/"
                            className="group flex items-center gap-2.5 transition-all duration-300"
                        >
                            <motion.div
                                whileHover={{ rotate: 8, scale: 1.08 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="relative"
                            >
                                <Image
                                    src="/AIHUB.svg"
                                    alt="AIHUB logo"
                                    width={36}
                                    height={36}
                                    className="rounded-xl"
                                    priority
                                />
                                {/* Logo glow */}
                                <div className="absolute -inset-1 rounded-xl bg-violet-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>
                            <span className="text-[15px] font-bold tracking-tight bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                                AIHUB
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop NavLinks */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden md:flex items-center gap-0.5 rounded-xl bg-white/[0.04] p-1"
                    >
                        {navLinks.map((link, i) => {
                            const isActive = checkIsActive(link.href)
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onMouseEnter={() => setHoveredLink(link.href)}
                                    onMouseLeave={() => setHoveredLink(null)}
                                    className={cn(
                                        "relative rounded-lg px-4 py-1.5 text-[13px] font-medium transition-colors duration-200",
                                        isActive
                                            ? "text-white"
                                            : "text-neutral-400 hover:text-white"
                                    )}
                                >
                                    {/* Active pill background */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-0 rounded-lg -z-10"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, rgba(139,92,246,.5), rgba(59,130,246,.4))",
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 350,
                                                damping: 30,
                                            }}
                                        >
                                            {/* Active glow */}
                                            <div className="absolute -inset-1 rounded-xl bg-violet-500/25 blur-lg" />
                                        </motion.div>
                                    )}

                                    {/* Hover highlight (only for non-active) */}
                                    <AnimatePresence>
                                        {hoveredLink === link.href && !isActive && (
                                            <motion.div
                                                layoutId="hover-pill"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute inset-0 rounded-lg bg-white/[0.06] -z-10"
                                            />
                                        )}
                                    </AnimatePresence>

                                    {link.label}
                                </Link>
                            )
                        })}
                    </motion.div>

                    {/* Desktop CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden md:flex items-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-20 h-8 rounded-lg bg-white/[0.05] animate-pulse" />
                        ) : user ? (
                            /* Logged-in state */
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-violet-500/20">
                                        <User className="size-4 text-violet-300" />
                                    </div>
                                    <span className="text-[13px] font-medium text-neutral-300 max-w-[100px] truncate">
                                        {user.name}
                                    </span>
                                </div>
                                <motion.button
                                    onClick={logout}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-neutral-400 hover:text-red-400 border border-white/[0.08] hover:border-red-500/30 transition-all duration-200 hover:bg-red-500/[0.08]"
                                >
                                    <LogOut className="size-3.5" />
                                    Logout
                                </motion.button>
                            </div>
                        ) : (
                            /* Logged-out state */
                            <>
                                <Link
                                    href="/login"
                                    className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors duration-200 px-3 py-1.5"
                                >
                                    Log in
                                </Link>
                                <Link href="/signup">
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="group relative flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[13px] font-semibold text-white overflow-hidden"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #7c3aed, #3b82f6)",
                                        }}
                                    >
                                        {/* Shimmer overlay */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent)",
                                                backgroundSize: "200% 100%",
                                                animation: "shimmer 2s infinite",
                                            }}
                                        />
                                        <Sparkles className="size-3.5" />
                                        Get Started
                                        <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </motion.div>
                                </Link>
                            </>
                        )}
                    </motion.div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger>
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="relative p-2 rounded-lg hover:bg-white/[0.06] transition-colors duration-200"
                                >
                                    <Menu className="h-5 w-5 text-neutral-300" />
                                </motion.div>
                            </SheetTrigger>

                            <SheetContent
                                side="right"
                                className="w-80 border-white/[0.06] bg-black/90 backdrop-blur-2xl p-0 text-white"
                            >
                                <SheetHeader className="p-6 pb-4 border-b border-white/[0.06]">
                                    <SheetTitle className="flex items-center gap-2.5 text-white">
                                        <Image
                                            src="/AIHUB.svg"
                                            alt="AIHUB logo"
                                            width={28}
                                            height={28}
                                            className="rounded-lg"
                                        />
                                        <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                                            AIHUB
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="flex flex-col gap-1 p-4">
                                    {navLinks.map((link, i) => {
                                        const isActive = checkIsActive(link.href)
                                        return (
                                            <Link
                                                key={link.label}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "relative w-full rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                                    isActive
                                                        ? "text-white"
                                                        : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                                                )}
                                            >
                                                {isActive && (
                                                    <div
                                                        className="absolute inset-0 rounded-xl -z-10"
                                                        style={{
                                                            background:
                                                                "linear-gradient(135deg, rgba(139,92,246,.3), rgba(59,130,246,.2))",
                                                        }}
                                                    />
                                                )}
                                                {link.label}
                                            </Link>
                                        )
                                    })}
                                </div>

                                <div className="mt-auto p-4 pt-2 flex flex-col gap-2 border-t border-white/[0.06]">
                                    {isLoading ? (
                                        <div className="h-10 rounded-xl bg-white/[0.05] animate-pulse" />
                                    ) : user ? (
                                        /* Mobile logged-in state */
                                        <>
                                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                                                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-violet-500/20">
                                                    <User className="size-4 text-violet-300" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-white truncate max-w-[160px]">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-neutral-500 truncate max-w-[160px]">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false)
                                                    logout()
                                                }}
                                                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/[0.08] transition-all duration-200"
                                            >
                                                <LogOut className="size-4" />
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        /* Mobile logged-out state */
                                        <>
                                            <Link
                                                href="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-300 border border-white/[0.08] hover:bg-white/[0.04] hover:text-white transition-all duration-200"
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                href="/signup"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, #7c3aed, #3b82f6)",
                                                }}
                                            >
                                                <Sparkles className="size-3.5" />
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </nav>
            </motion.div>


        </motion.header>
    )
}
