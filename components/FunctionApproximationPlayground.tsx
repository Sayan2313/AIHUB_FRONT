"use client"

import type { FormEvent } from "react"
import { useState } from "react"

import { FunctionGraph } from "@/components/FunctionGraph"
import { generateFunctionPoints } from "@/lib/function-expression"
import type {
  ActivationFunction,
  FunctionGraphPoint,
  FunctionApproximationRequest,
  FunctionApproximationResponse,
} from "@/types/function-playground"

const apiBaseUrl =
  process.env.NEXT_PUBLIC_FASTAPI_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8000"

const initialForm: FunctionApproximationRequest = {
  expression: "10*x + 3",
  xMin: -10,
  xMax: 10,
  points: 100,
  neuronsPerLayer: [64, 64],
  epochs: 500,
  seed: 42,
  learningRate: 0.001,
  activation: "tanh",
}

const activationOptions: ActivationFunction[] = ["relu", "tanh", "sigmoid", "linear"]
const expressionTokens = [
  ["7", "8", "9", "/", "("],
  ["4", "5", "6", "*", ")"],
  ["1", "2", "3", "-", "**"],
  ["0", ".", "x", "+","abs("],
  ["log(","exp(","sin(","cos(", "tan("]
]

export function FunctionApproximationPlayground() {
  const [form, setForm] = useState<FunctionApproximationRequest>(initialForm)
  const [layersInput, setLayersInput] = useState(initialForm.neuronsPerLayer.join(", "))
  const [predictedPoints, setPredictedPoints] = useState<FunctionGraphPoint[]>([])
  const [avgTrainLoss, setAvgTrainLoss] = useState<number | null>(null)
  const [trainTimeMs, setTrainTimeMs] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function updateForm(nextForm: FunctionApproximationRequest) {
    setForm(nextForm)
    setPredictedPoints([])
    setAvgTrainLoss(null)
    setTrainTimeMs(null)
    setError(null)
  }

  function parseLayers(value: string) {
    const layers = value
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((layer) => Number.isFinite(layer) && layer > 0)

    if (layers.length === 0) {
      throw new Error("Enter neurons per layer as comma-separated positive numbers.")
    }

    return layers
  }

  function calculateParameterCount(neuronsPerLayer: number[]) {
    const layerSizes = [1, ...neuronsPerLayer, 1]

    return layerSizes.slice(1).reduce((total, currentLayerSize, index) => {
      const previousLayerSize = layerSizes[index]
      const weights = previousLayerSize * currentLayerSize
      const biases = currentLayerSize

      return total + weights + biases
    }, 0)
  }

  function appendExpression(token: string) {
    const normalizedToken =
      token === "pi" ? `${Math.PI}` : token === "e" ? `${Math.E}` : token

    updateForm({
      ...form,
      expression: `${form.expression}${normalizedToken}`,
    })
  }

  function clearExpression() {
    updateForm({
      ...form,
      expression: "",
    })
  }

  function backspaceExpression() {
    updateForm({
      ...form,
      expression: form.expression.slice(0, -1),
    })
  }

  let actualPoints: FunctionGraphPoint[] = []
  let validationError: string | null = null

  try {
    actualPoints = generateFunctionPoints(
      form.expression,
      form.xMin,
      form.xMax,
      form.points
    )
  } catch (generationError) {
    actualPoints = []
    if (generationError instanceof Error) {
      validationError = generationError.message
    }
  }

  const parameterCount = calculateParameterCount(form.neuronsPerLayer)

  function formatTrainingTime(durationMs: number) {
    if (durationMs >= 1000) {
      return `${(durationMs / 1000).toFixed(durationMs >= 10000 ? 0 : 2)} s`
    }

    return `${Math.round(durationMs)} ms`
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      generateFunctionPoints(
        form.expression,
        form.xMin,
        form.xMax,
        form.points
      )

      const response = await fetch(`${apiBaseUrl}/api/funcapproximate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error("Backend request failed.")
      }

      const payload = (await response.json()) as FunctionApproximationResponse
      const xValues = payload.predicted?.x ?? []
      const yValues = payload.predicted?.y ?? []

      if (xValues.length !== yValues.length) {
        throw new Error("Backend returned mismatched predicted x and y arrays.")
      }

      const nextPredictedPoints = xValues.map((x, index) => ({
        x,
        y: yValues[index],
      }))

      setPredictedPoints(nextPredictedPoints)
      setAvgTrainLoss(
        payload.predicted.Avg_Train_loss ?? payload.predicted.avgTrainLoss ?? null
      )
      setTrainTimeMs(
        payload.predicted.trainTimeMs ?? payload.predicted.trainingTimeMs ?? null
      )
    } catch (submissionError) {
      setPredictedPoints([])
      setAvgTrainLoss(null)
      setTrainTimeMs(null)
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to load the trained function graph."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 xl:px-10">
      <div className="grid gap-8 xl:grid-cols-[minmax(560px,680px)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
            Function Playground
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Approximate a mathematical function
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Enter a function, choose the x-range, and set how many points model
            should train on.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="block text-sm font-medium text-foreground">Function</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={backspaceExpression}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    Backspace
                  </button>
                  <button
                    type="button"
                    onClick={clearExpression}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                {form.expression || "Click the buttons below to build a function."}
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {expressionTokens.flat().map((token) => (
                  <button
                    key={token}
                    type="button"
                    onClick={() => appendExpression(token)}
                    className="rounded-2xl border border-border bg-background px-3 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">X min</span>
                <input
                  type="number"
                  value={form.xMin}
                  onChange={(event) =>
                    updateForm({ ...form, xMin: Number(event.target.value) })
                  }
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">X max</span>
                <input
                  type="number"
                  value={form.xMax}
                  onChange={(event) =>
                    updateForm({ ...form, xMax: Number(event.target.value) })
                  }
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Points</span>
                <input
                  type="number"
                  min={10}
                  max={10000}
                  value={form.points}
                  onChange={(event) =>
                    updateForm({ ...form, points: Number(event.target.value) })
                  }
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">
                Neurons each layer
              </span>
              <input
                value={layersInput}
                onChange={(event) => {
                  const nextValue = event.target.value
                  setLayersInput(nextValue)

                  try {
                    updateForm({
                      ...form,
                      neuronsPerLayer: parseLayers(nextValue),
                    })
                  } catch {
                    setPredictedPoints([])
                    setAvgTrainLoss(null)
                    setError("Enter neurons per layer as comma-separated positive numbers.")
                  }
                }}
                placeholder="64, 64, 32"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Total parameters (weights + biases): {parameterCount}
              </p>
            </label>

            <div className="rounded-3xl border border-border/70 bg-muted/25 p-4">
              <div className="mb-4">
                <p className="text-sm font-semibold text-foreground">Training Settings</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Adjust optimization and initialization before sending the request.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <label className="block rounded-2xl border border-border/70 bg-background px-4 py-3">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Epochs
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={form.epochs}
                    onChange={(event) =>
                      updateForm({ ...form, epochs: Number(event.target.value) })
                    }
                    className="w-full bg-transparent text-base font-medium text-foreground outline-none"
                  />
                </label>

                <label className="block rounded-2xl border border-border/70 bg-background px-4 py-3">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Learning Rate
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="0.0001"
                    value={form.learningRate}
                    onChange={(event) =>
                      updateForm({ ...form, learningRate: Number(event.target.value) })
                    }
                    className="w-full bg-transparent text-base font-medium text-foreground outline-none"
                  />
                </label>

                <label className="block rounded-2xl border border-border/70 bg-background px-4 py-3">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Seed
                  </span>
                  <input
                    type="number"
                    step={1}
                    value={form.seed}
                    onChange={(event) =>
                      updateForm({ ...form, seed: Math.trunc(Number(event.target.value)) })
                    }
                    className="w-full bg-transparent text-base font-medium text-foreground outline-none"
                  />
                </label>

                <label className="block rounded-2xl border border-border/70 bg-background px-4 py-3">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Activation
                  </span>
                  <select
                    value={form.activation}
                    onChange={(event) =>
                      updateForm({
                        ...form,
                        activation: event.target.value as ActivationFunction,
                      })
                    }
                    className="w-full bg-transparent text-base font-medium text-foreground outline-none"
                  >
                    {activationOptions.map((activation) => (
                      <option key={activation} value={activation}>
                        {activation}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Training model..." : "Run"}
            </button>
          </form>

          {validationError ? (
            <p className="mt-4 rounded-2xl border border-amber-300/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              {validationError}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-300/50 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          ) : null}
        </div>

        <div className="space-y-4">
          {avgTrainLoss !== null ? (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-2xl uppercase tracking-[0.2em] text-muted-foreground">
                Training Summary
              </p>
              <p className="mt-2 text-1xl font-semibold tracking-tight text-foreground">
                Avg Train Loss (RMSE): {avgTrainLoss}
              </p>
              {trainTimeMs !== null ? (
                <p className="mt-2 text-1xl text-muted-foreground">
                  Training Time: {formatTrainingTime(trainTimeMs)}
                </p>
              ) : null}
            </div>
          ) : null}

          <FunctionGraph
            title="Actual Function Graph"
            points={actualPoints}
            lineColor="#22c55e"
            emptyMessage="Build a valid function to render the actual graph."
          />
          <FunctionGraph
            title="Predicted Function Graph"
            points={predictedPoints}
            lineColor="#2563eb"
            emptyMessage="Train the model to render the predicted graph."
          />
        </div>
      </div>
    </section>
  )
}
