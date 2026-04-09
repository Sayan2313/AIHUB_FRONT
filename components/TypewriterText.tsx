"use client"

import { useEffect, useState } from "react"

interface TypewriterTextProps {
  text: string
  className?: string
}

export function TypewriterText({ text, className }: TypewriterTextProps) {
  const [visibleText, setVisibleText] = useState("")

  useEffect(() => {
    let currentIndex = 0
    const timer = window.setInterval(() => {
      currentIndex += 1
      setVisibleText(text.slice(0, currentIndex))

      if (currentIndex >= text.length) {
        window.clearInterval(timer)
      }
    }, 90)

    return () => window.clearInterval(timer)
  }, [text])

  return (
    <span className={className}>
      <span className="typewriter-wrapper">
        <span>{visibleText}</span>
        <span aria-hidden="true" className="typewriter-cursor" />
      </span>
    </span>
  )
}
