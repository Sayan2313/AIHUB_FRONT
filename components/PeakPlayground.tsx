"use client"

import type { FormEvent } from "react"
import { useState, useRef, useEffect } from "react"
import { buildApiUrl } from "@/lib/api"
import { formatDurationMs } from "@/lib/format"
import { buildPeakRequest, peakApiPath, peakSamplePrompts } from "@/lib/peak"
import type { PeakPrediction, PeakResponse } from "@/types/peak-playground"
import { Robot, User } from "@phosphor-icons/react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  trainTimeMs?: number | null
}

export function PeakPlayground() {
  const [inputText, setInputText] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modelSize, setModelSize] = useState<"small" | "medium" | "large">("small")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize the textarea to fit content.
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }, [inputText])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedInput = inputText.trim()

    if (!normalizedInput) {
      setError("Type a message before sending.")
      return
    }

    const userMessage: ChatMessage = { role: "user", content: normalizedInput }
    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(buildApiUrl(peakApiPath), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildPeakRequest(normalizedInput, modelSize)),
      })

      if (!response.ok) {
        throw new Error("Backend request failed.")
      }

      const payload = (await response.json()) as PeakResponse

      if (!payload.predicted) {
        throw new Error("Backend response did not include a prediction.")
      }

      const prediction: PeakPrediction = payload.predicted

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: prediction.response,
        trainTimeMs: prediction.trainTimeMs,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to get a response from Peak."
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      const form = event.currentTarget.closest("form")
      if (form) form.requestSubmit()
    }
  }

  return (
    <section className="mx-auto flex h-[calc(100vh-80px)] w-full max-w-5xl flex-col px-4 py-6 sm:px-6 xl:px-10">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
            Peak Playground
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Chat with Peak
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
            {(["small", "medium", "large"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setModelSize(size)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
                  modelSize === size
                    ? "bg-foreground text-background shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setMessages([])
                setError(null)
              }}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground shadow-sm"
            >
              Clear chat
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-3xl border border-border bg-card p-4 shadow-sm">
        {messages.length === 0 && !isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            {/* Empty state */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 shadow-inner">
              <Robot size={28} weight="duotone" className="text-foreground/80" />
            </div>
            <p className="text-center text-sm leading-6 text-muted-foreground">
              Start a conversation or try one of the prompts below.
            </p>
            <div className="flex max-w-xl flex-wrap justify-center gap-2">
              {peakSamplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInputText(prompt)}
                  className="max-w-full whitespace-normal rounded-2xl border border-border bg-background px-4 py-2 text-left text-xs leading-5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-foreground text-background"
                      : "border border-border bg-muted/40 text-foreground"
                  }`}
                >
                  {/* Avatar label with icons */}
                  <div
                    className={`mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest ${
                      msg.role === "user"
                        ? "text-background/60"
                        : "bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <>
                        <User size={14} weight="bold" className="text-background/60" />
                        <span>You</span>
                      </>
                    ) : (
                      <>
                        <Robot size={14} weight="fill" className="text-indigo-400" />
                        <span>Peak</span>
                      </>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Latency badge for assistant messages */}
                  {msg.role === "assistant" &&
                    msg.trainTimeMs !== null &&
                    msg.trainTimeMs !== undefined && (
                      <span className="mt-2 inline-block rounded-full bg-background/80 px-2.5 py-0.5 text-[10px] tracking-wide text-muted-foreground">
                        ⏱ {formatDurationMs(msg.trainTimeMs)}
                      </span>
                    )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-muted/40 px-4 py-3">
                  <span className="qwen-dot qwen-dot-1" />
                  <span className="qwen-dot qwen-dot-2" />
                  <span className="qwen-dot qwen-dot-3" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error ? (
        <p className="mt-2 rounded-2xl border border-red-300/50 bg-red-500/10 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {/* Input bar */}
      <form
        className="mt-3 flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm"
        onSubmit={handleSubmit}
      >
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(event) => {
            setInputText(event.target.value)
            setError(null)
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Message Peak..."
          className="flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        </button>
      </form>
    </section>
  )
}
