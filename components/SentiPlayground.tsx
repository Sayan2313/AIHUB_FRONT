"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { buildApiUrl } from "@/lib/api"
import { formatDurationMs } from "@/lib/format"
import { buildSentimentRequest, sentiApiPath, sentiSamplePrompts } from "@/lib/senti"
import type { SentimentPrediction, SentimentResponse } from "@/types/senti-playground"

export function SentiPlayground() {
  const [inputText, setInputText] = useState(sentiSamplePrompts[0])
  const [result, setResult] = useState<SentimentPrediction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedInput = inputText.trim()

    if (!normalizedInput) {
      setError("Enter some text before running sentiment analysis.")
      setResult(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(buildApiUrl(sentiApiPath), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildSentimentRequest(normalizedInput)),
      })

      if (!response.ok) {
        throw new Error("Backend request failed.")
      }

      const payload = (await response.json()) as SentimentResponse

      if (!payload.predicted) {
        throw new Error("Backend response did not include a prediction.")
      }

      setResult(payload.predicted)
    } catch (submissionError) {
      setResult(null)
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to run sentiment analysis."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const confidenceScore = result ? Math.max(0, Math.min(1, result.score)) : 0
  const confidencePercent = confidenceScore * 100
  const isPositive = result?.label.toUpperCase() === "POSITIVE"

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 xl:px-10">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,720px)_minmax(320px,1fr)]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
            Senti Playground
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Analyze the sentiment of a sentence
          </h1>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="block text-sm font-medium text-foreground">Write the Sentence </span>
                <button
                  type="button"
                  onClick={() => {
                    setInputText("")
                    setResult(null)
                    setError(null)
                  }}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={inputText}
                onChange={(event) => {
                  setInputText(event.target.value)
                  setError(null)
                }}
                rows={8}
                placeholder="Type a sentence to classify..."
                className="min-h-48 w-full resize-none rounded-3xl border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition focus:border-foreground"
              />
            </label>

            <div className="rounded-3xl border border-border/70 bg-muted/25 p-4">
              <p className="text-sm font-semibold text-foreground">Quick examples</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sentiSamplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setInputText(prompt)
                      setResult(null)
                      setError(null)
                    }}
                    className="max-w-full whitespace-normal rounded-3xl border border-border bg-background px-4 py-2 text-left text-xs leading-5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Analyzing sentiment..." : "Run"}
            </button>
          </form>

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-300/50 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Prediction
            </p>
            {result ? (
              <>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Label
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                      {result.label}
                    </p>
                  </div>
                </div>

                  <div className="mt-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <span>Confidence</span>
                    <span>{confidencePercent.toFixed(2)}%</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isPositive ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{ width: `${confidencePercent}%` }}
                    />
                  </div>
                </div>

                <dl className="mt-6">
                  <div className="rounded-2xl border border-border/70 bg-background p-4">
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Time Taken
                    </dt>
                    <dd className="mt-2 text-lg font-medium text-foreground">
                      {result.trainTimeMs !== null && result.trainTimeMs !== undefined
                        ? formatDurationMs(result.trainTimeMs)
                        : "N/A"}
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Run the model to see the backend prediction.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
