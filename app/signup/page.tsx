"use client"

import { useState, FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
    }),
}

export default function SignupPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const { signup } = useAuth()

    const handleChange = (field: string, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }))
        if (error) setError(null)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        if (formState.password.length < 6) {
            setError("Password must be at least 6 characters")
            setIsSubmitting(false)
            return
        }

        const result = await signup(formState.name, formState.email, formState.password)

        if (result.success) {
            setSuccess(true)
            setTimeout(() => {
                router.push("/models")
            }, 1200)
        } else {
            setError(result.error || "Signup failed. Please try again.")
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
                    <div className="w-72 h-72 rounded-full bg-gradient-to-br from-blue-600/20 to-violet-600/20 blur-3xl" />
                </div>

                <div className="relative rounded-3xl border border-white/[0.08] bg-black/40 backdrop-blur-2xl p-8 shadow-2xl">
                    {/* Top Accent */}
                    <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                    
                    <div className="text-center mb-8">
                        <motion.div custom={0} variants={fadeUp} className="inline-flex items-center justify-center mb-4">
                             <div className="relative flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20">
                                 <Sparkles className="size-6 text-blue-400" />
                                 <div className="absolute -inset-1 rounded-xl bg-blue-500/20 blur-md opacity-50" />
                             </div>
                        </motion.div>
                        <motion.h1 custom={1} variants={fadeUp} className="text-2xl font-bold tracking-tight text-white mb-2">
                            Create an account
                        </motion.h1>
                        <motion.p custom={2} variants={fadeUp} className="text-sm text-neutral-400">
                            Join AIHUB to explore our models.
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

                    {/* Success Message */}
                    <AnimatePresence>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-3"
                            >
                                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                                <span className="text-sm text-emerald-300">Account created! Redirecting...</span>
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
                            id="name"
                            label="Full Name"
                            icon={User}
                            placeholder="John Doe"
                            value={formState.name}
                            onChange={(v) => handleChange("name", v)}
                            focused={focusedField === "name"}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            required
                        />

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

                        <motion.button
                            type="submit"
                            disabled={isSubmitting || success}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative mt-4 flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                            style={{
                                background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
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
                                    Create Account
                                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    <motion.div custom={4} variants={fadeUp} className="mt-8 text-center text-sm text-neutral-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Log in
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
                        ? "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,.15)] bg-white/[0.04]"
                        : "border-white/[0.1] hover:border-white/[0.15] bg-white/[0.02]"
                }`}
            >
                <Icon
                    className={`absolute left-3.5 size-4 transition-colors duration-300 ${
                        focused ? "text-blue-400" : "text-neutral-500"
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
