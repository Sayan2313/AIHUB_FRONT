"use client"

import { useState, FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, MessageSquare, User, Send, Sparkles, CheckCircle, MapPin, Clock, ArrowUpRight } from "lucide-react"
import Footer from "@/app/_components/Footer"

const contactInfo = [
    {
        icon: Mail,
        label: "Email",
        value: "hello@aihub.dev",
        href: "mailto:hello@aihub.dev",
    },
    {
        icon: MapPin,
        label: "Location",
        value: "San Francisco, CA",
        href: null,
    },
    {
        icon: Clock,
        label: "Response Time",
        value: "Within 24 hours",
        href: null,
    },
]

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
    }),
}

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleChange = (field: string, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1500))
        setIsSubmitting(false)
        setIsSubmitted(true)
    }

    return (
        <div className="flex flex-col min-h-[calc(100dvh-4rem)]">
            <section className="flex-1 w-full max-w-6xl mx-auto px-6 py-16 lg:py-24">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        custom={0}
                        variants={fadeUp}
                        className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 mb-6"
                    >
                        <Sparkles className="size-3.5 text-violet-400" />
                        <span className="text-xs font-medium text-violet-300 tracking-wide uppercase">
                            Get in Touch
                        </span>
                    </motion.div>

                    <motion.h1
                        custom={1}
                        variants={fadeUp}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
                    >
                        <span className="bg-gradient-to-r from-white via-white to-neutral-500 bg-clip-text text-transparent">
                            Let&apos;s Build Something
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                            Amazing Together
                        </span>
                    </motion.h1>

                    <motion.p
                        custom={2}
                        variants={fadeUp}
                        className="mt-5 text-neutral-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
                    >
                        Have a question, feedback, or partnership idea? We&apos;d love to hear from you.
                    </motion.p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

                    {/* Left Column — Contact Info */}
                    <motion.div
                        className="lg:col-span-2 flex flex-col gap-6"
                        initial="hidden"
                        animate="visible"
                    >
                        {contactInfo.map((item, i) => (
                            <motion.div
                                key={item.label}
                                custom={i + 3}
                                variants={fadeUp}
                                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.04]"
                            >
                                {/* Subtle glow on hover */}
                                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-violet-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/10">
                                        <item.icon className="size-4 text-violet-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                                            {item.label}
                                        </p>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                className="text-sm font-medium text-white hover:text-violet-300 transition-colors inline-flex items-center gap-1 group/link"
                                            >
                                                {item.value}
                                                <ArrowUpRight className="size-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all duration-200" />
                                            </a>
                                        ) : (
                                            <p className="text-sm font-medium text-white">
                                                {item.value}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Decorative gradient orb */}
                        <div className="hidden lg:block relative h-40 mt-4">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-violet-600/15 to-blue-600/10 blur-3xl" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-sm text-neutral-600 italic text-center">
                                    &ldquo;The best way to predict the future<br />is to build it.&rdquo;
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column — Contact Form */}
                    <motion.div
                        className="lg:col-span-3"
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            custom={3}
                            variants={fadeUp}
                            className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8"
                        >
                            {/* Form border glow accent */}
                            <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

                            <AnimatePresence mode="wait">
                                {isSubmitted ? (
                                    /* Success State */
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        className="flex flex-col items-center justify-center text-center py-16 gap-5"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
                                            className="relative"
                                        >
                                            <CheckCircle className="size-16 text-emerald-400" />
                                            <div className="absolute -inset-3 rounded-full bg-emerald-500/20 blur-xl" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                                        <p className="text-neutral-400 text-sm max-w-sm">
                                            Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => {
                                                setIsSubmitted(false)
                                                setFormState({ name: "", email: "", subject: "", message: "" })
                                            }}
                                            className="mt-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
                                        >
                                            Send another message →
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    /* Form */
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col gap-5"
                                    >
                                        {/* Name & Email row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <FormField
                                                id="name"
                                                label="Name"
                                                icon={User}
                                                placeholder="Your name"
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
                                        </div>

                                        {/* Subject */}
                                        <FormField
                                            id="subject"
                                            label="Subject"
                                            icon={MessageSquare}
                                            placeholder="What's this about?"
                                            value={formState.subject}
                                            onChange={(v) => handleChange("subject", v)}
                                            focused={focusedField === "subject"}
                                            onFocus={() => setFocusedField("subject")}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                        />

                                        {/* Message */}
                                        <div className="flex flex-col gap-2">
                                            <label
                                                htmlFor="message"
                                                className="text-xs font-medium text-neutral-400 uppercase tracking-wider"
                                            >
                                                Message
                                            </label>
                                            <div
                                                className={`relative rounded-xl border transition-all duration-300 ${
                                                    focusedField === "message"
                                                        ? "border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,.1)]"
                                                        : "border-white/[0.08] hover:border-white/[0.12]"
                                                }`}
                                            >
                                                <textarea
                                                    id="message"
                                                    rows={5}
                                                    required
                                                    placeholder="Tell us more..."
                                                    value={formState.message}
                                                    onChange={(e) => handleChange("message", e.target.value)}
                                                    onFocus={() => setFocusedField("message")}
                                                    onBlur={() => setFocusedField(null)}
                                                    className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none resize-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group relative mt-2 flex items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold text-white overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,.2)]"
                                            style={{
                                                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                                            }}
                                        >
                                            {/* Shimmer */}
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                style={{
                                                    background:
                                                        "linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent)",
                                                    backgroundSize: "200% 100%",
                                                    animation: "shimmer 2s infinite",
                                                }}
                                            />

                                            {isSubmitting ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                        className="size-4 border-2 border-white/30 border-t-white rounded-full"
                                                    />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="size-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

/* ─── Reusable Form Field ─── */
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
        <div className="flex flex-col gap-2">
            <label
                htmlFor={id}
                className="text-xs font-medium text-neutral-400 uppercase tracking-wider"
            >
                {label}
            </label>
            <div
                className={`relative flex items-center rounded-xl border transition-all duration-300 ${
                    focused
                        ? "border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,.1)]"
                        : "border-white/[0.08] hover:border-white/[0.12]"
                }`}
            >
                <Icon
                    className={`absolute left-3.5 size-4 transition-colors duration-200 ${
                        focused ? "text-violet-400" : "text-neutral-600"
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
                    className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                />
            </div>
        </div>
    )
}
