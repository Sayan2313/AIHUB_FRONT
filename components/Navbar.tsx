"use client"

import Link from "next/link"

export function Navbar() {
    return (
        <header className="w-full border-b border-border/60 bg-background/95 backdrop-blur">
            <nav className="mx-auto flex max-w-5xl items-center justify-center px-4 py-4">
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-sm">
                    <Link href="/" className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
                        Home
                    </Link>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Link href="/" className="rounded-full px-4 py-2 transition-colors hover:bg-muted hover:text-foreground">
                            Features
                        </Link>
                        <Link href="/" className="rounded-full px-4 py-2 transition-colors hover:bg-muted hover:text-foreground">
                            Contact
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}
