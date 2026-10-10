"use client"

import { useState, FormEvent, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, LogIn, Sparkles, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
    }),
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginPageContent />
        </Suspense>
    )
}

function LoginPageContent() {
    const [formState, setFormState] = useState({
        email: "",
        password: "",
    })
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login } = useAuth()

    const handleChange = (field: string, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }))
        if (error) setError(null)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const result = await login(formState.email, formState.password)

        if (result.success) {
            const callbackUrl = searchParams.get("callbackUrl") || "/"
            router.push(callbackUrl)
        } else {
            setError(result.error || "Login failed. Please try again.")
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col min-h-[calc(100dvh-4rem)] items-center justify-center p-6">
            <motion.div
                className="w-full max-w-md relative"
                initial="hidden"
                animate="visible"
            >
                {/* Background decorative elements */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center">
                    <div className="w-72 h-72 rounded-full bg-gradient-to-br from-violet-600/20 to-blue-600/20 blur-3xl" />
                </div>

                <div className="relative rounded-3xl border border-white/[0.08] bg-black/40 backdrop-blur-2xl p-8 shadow-2xl">
                    {/* Top Accent */}
                    <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
                    
                    <div className="text-center mb-8">
                        <motion.div custom={0} variants={fadeUp} className="inline-flex items-center justify-center mb-4">
                             <div className="relative flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20">
                                 <Sparkles className="size-6 text-violet-400" />
                                 <div className="absolute -inset-1 rounded-xl bg-violet-500/20 blur-md opacity-50" />
                             </div>
                        </motion.div>
                        <motion.h1 custom={1} variants={fadeUp} className="text-2xl font-bold tracking-tight text-white mb-2">
                            Welcome back
                        </motion.h1>
                        <motion.p custom={2} variants={fadeUp} className="text-sm text-neutral-400">
                            Enter your credentials to access your account.
                        </motion.p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3"
                            >
                                <AlertCircle className="size-4 text-red-400 shrink-0" />
                                <span className="text-sm text-red-300">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.form
                        custom={3}
                        variants={fadeUp}
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
                        <FormField
                            id="email"
                            label="Email"
                            icon={Mail}
                            type="email"
                            placeholder="you@email.com"
                            value={formState.email}
                            onChange={(v) => handleChange("email", v)}
                            focused={focusedField === "email"}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            required
                        />

                        <FormField
                            id="password"
                            label="Password"
                            icon={Lock}
                            type="password"
                            placeholder="••••••••"
                            value={formState.password}
                            onChange={(v) => handleChange("password", v)}
                            focused={focusedField === "password"}
                            onFocus={() => setFocusedField("password")}
                            onBlur={() => setFocusedField(null)}
                            required
                        />
                        
                        <div className="flex items-center justify-between mt-[-4px]">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-white/[0.1] bg-white/[0.05] text-violet-500 focus:ring-violet-500 focus:ring-offset-black accent-violet-500" />
                                <span className="text-xs text-neutral-400">Remember me</span>
                            </label>
                            <Link href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative mt-4 flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                            style={{
                                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                            }}
                        >
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background:
                                        "linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent)",
                                    backgroundSize: "200% 100%",
                                    animation: "shimmer 2s infinite",
                                }}
                            />
                            {isSubmitting ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="size-4 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                <>
                                    Log In
                                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    <motion.div custom={4} variants={fadeUp} className="mt-8 text-center text-sm text-neutral-400">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                            Sign up
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

interface FormFieldProps {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    type?: string
    placeholder: string
    value: string
    onChange: (value: string) => void
    focused: boolean
    onFocus: () => void
    onBlur: () => void
    required?: boolean
}

function FormField({
    id,
    label,
    icon: Icon,
    type = "text",
    placeholder,
    value,
    onChange,
    focused,
    onFocus,
    onBlur,
    required,
}: FormFieldProps) {
    return (
        <div className="flex flex-col gap-2 relative">
            <label
                htmlFor={id}
                className="text-xs font-medium text-neutral-400 uppercase tracking-wider pl-1"
            >
                {label}
            </label>
            <div
                className={`relative flex items-center rounded-xl border transition-all duration-300 ${
                    focused
                        ? "border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,.15)] bg-white/[0.04]"
                        : "border-white/[0.1] hover:border-white/[0.15] bg-white/[0.02]"
                }`}
            >
                <Icon
                    className={`absolute left-3.5 size-4 transition-colors duration-300 ${
                        focused ? "text-violet-400" : "text-neutral-500"
                    }`}
                />
                <input
                    id={id}
                    type={type}
                    required={required}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                />
            </div>
        </div>
    )
}
