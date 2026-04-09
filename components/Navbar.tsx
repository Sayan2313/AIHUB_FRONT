"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export function Navbar() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/", label: "Features" },
    { href: "/", label: "Contact" },
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full border-b border-border/50 bg-background/90 backdrop-blur"
    >
      <nav className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="flex items-center gap-3 text-foreground transition-opacity hover:opacity-75"
          >
            <Image
              src="/AIHUB.svg"
              alt="AIHUB logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-2xl"
            />
            <span className="text-lg font-medium tracking-tight">AIHUB</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
          className="flex items-center gap-1 sm:gap-2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground sm:px-4 ${
                link.label === "Home"
                  ? "bg-foreground font-medium text-background"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </nav>
    </motion.header>
  )
}
