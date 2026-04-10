"use client"

import { motion, type Variants } from "framer-motion"
import { modelOptions } from "@/lib/models"
import { ModelCard } from "@/components/ModelCard"
import { TypewriterText } from "@/components/TypewriterText"

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

export function ModelsSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
      className="mx-auto max-w-5xl px-6 py-16"
    >
      <motion.div variants={cardVariants} className="mx-auto max-w-2xl text-center">
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
          <TypewriterText text="Explore Our Models" />
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modelOptions.map((model) => (
          <motion.div key={model.id} variants={cardVariants}>
            <ModelCard model={model} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
