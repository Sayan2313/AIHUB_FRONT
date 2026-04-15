"use client"

import type { FormEvent } from "react"
import { useState, useRef, useEffect } from "react"
import { buildApiUrl, extractFetchError } from "@/lib/api"
import { formatDurationMs } from "@/lib/format"
import { buildQwenRequest, qwenApiPath, qwenSamplePrompts } from "@/lib/qwen"
import type { QwenPrediction, QwenResponse } from "@/types/qwen-playground"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  trainTimeMs?: number | null
}

export function QwenPlayground() {
  const [inputText, setInputText] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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
      const response = await fetch(buildApiUrl(qwenApiPath), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildQwenRequest(normalizedInput)),
      })

      if (!response.ok) {
        const detail = await extractFetchError(response, "Backend request failed")
        throw new Error(detail)
      }

      const payload = (await response.json()) as QwenResponse

      if (!payload.predicted) {
        throw new Error("Backend response did not include a prediction.")
      }

      const prediction: QwenPrediction = payload.predicted

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: prediction.response ?? "(empty response)",
        trainTimeMs: prediction.trainTimeMs,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to get a response from Qwen."
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
            Qwen Playground
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Chat with Qwen
          </h1>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMessages([])
              setError(null)
            }}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-3xl border border-border bg-card p-4 shadow-sm">
        {messages.length === 0 && !isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            {/* Empty state */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/60"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-center text-sm leading-6 text-muted-foreground">
              Start a conversation or try one of the prompts below.
            </p>
            <div className="flex max-w-xl flex-wrap justify-center gap-2">
              {qwenSamplePrompts.map((prompt) => (
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
                  {/* Avatar label */}
                  <span
                    className={`mb-1 block text-[10px] font-semibold uppercase tracking-widest ${
                      msg.role === "user"
                        ? "text-background/60"
                        : "bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
                    }`}
                  >
                    {msg.role === "user" ? "You" : "Qwen"}
                  </span>
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
          placeholder="Send a message..."
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
