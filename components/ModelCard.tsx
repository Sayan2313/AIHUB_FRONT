"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { ModelOption } from "@/types/model"

// Maps capability values from the type layer to the badge text shown in the UI.
const capabilityLabels: Record<ModelOption["capabilities"][number], string> = {
  text: "Text",
  image: "Image",
  function: "Function",
}

const modelIcons: Record<string, { src: string; alt: string }> = {
  "function-approximation": {
    src: "/function.svg",
    alt: "Function model icon",
  },
  peak: {
    src: "/chatbot.svg",
    alt: "Chatbot model icon",
  },
  senti: {
    src: "/sentiment-analysis.svg",
    alt: "Sentiment analysis model icon",
  },
}

interface ModelCardProps {
  model: ModelOption
}

export function ModelCard({ model }: ModelCardProps) {
  const icon = modelIcons[model.id] ?? modelIcons["function-approximation"]

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-foreground shadow-sm"
            >
              <Image src={icon.src} alt={icon.alt} width={28} height={28} className="h-7 w-7" />
            </motion.div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Model</p>
              <h3
                className={`mt-1 text-2xl font-semibold tracking-tight text-foreground ${
                  model.id === "function-approximation" ? "whitespace-nowrap" : "break-words"
                }`}
              >
                {model.name}
              </h3>
            </div>
          </div>
          <span className="shrink-0 self-start whitespace-nowrap rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            {model.pricing}
          </span>
        </div>

        <p className="mt-4 text-base font-medium text-foreground">{model.summary}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{model.description}</p>

        {/* Render one badge per capability so users can scan supported modes quickly. */}
        <div className="mt-5 flex flex-wrap gap-2">
          {model.capabilities.map((capability) => (
            <span
              key={capability}
              className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
            >
              {capabilityLabels[capability]}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="text-muted-foreground">Latency: {model.latency}</span>
        {model.playgroundPath ? (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={model.playgroundPath}
            className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-90"
          >
            Try
          </Link>
          </motion.div>
        ) : (
          <motion.button
            type="button"
            className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-90"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Try
          </motion.button>
        )}
      </div>
    </motion.article>
  )
}
