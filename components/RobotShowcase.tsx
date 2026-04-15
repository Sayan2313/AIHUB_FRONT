"use client"

import dynamic from "next/dynamic"

const RobotMascotScene = dynamic(() => import("@/components/RobotMascotScene"), {
  ssr: false,
  loading: () => (
    <div className="relative h-[560px] w-full">
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_34%)]" />
    </div>
  ),
})

export function RobotShowcase() {
  return (
    <section className="relative overflow-hidden px-6 py-16 sm:px-8 sm:py-20 bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.10),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.10),transparent_24%)] pointer-events-none" />
      <div className="mx-auto grid max-w-7xl items-center gap-50 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-xl">
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
            Welcome to AIHUB
          </h2>
          <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">
            We provide different types of model to try with custom configuration.
          </p>
        </div>

        <RobotMascotScene />
      </div>
    </section>
  )
}
