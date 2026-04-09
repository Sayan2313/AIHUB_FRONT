"use client"

import { useEffect, useRef } from "react"
import type { FunctionGraphPoint } from "@/types/function-playground"

interface PlotlyTrace {
  x: number[]
  y: number[]
  type: "scatter"
  mode: "lines"
  line: {
    color: string
    width: number
  }
  hovertemplate: string
}

interface PlotlyLayout {
  autosize: boolean
  font: {
    color: string
  }
  paper_bgcolor: string
  plot_bgcolor: string
  margin: {
    l: number
    r: number
    t: number
    b: number
  }
  xaxis: {
    title: { text: string }
    zerolinecolor: string
    gridcolor: string
  }
  yaxis: {
    title: { text: string }
    zerolinecolor: string
    gridcolor: string
  }
}

interface PlotlyInstance {
  newPlot: (
    root: HTMLDivElement,
    data: PlotlyTrace[],
    layout: PlotlyLayout,
    config: { displayModeBar: boolean; responsive: boolean }
  ) => Promise<void>
  purge: (root: HTMLDivElement) => void
}

interface FunctionGraphProps {
  title: string
  points: FunctionGraphPoint[]
  lineColor: string
  emptyMessage: string
}

export function FunctionGraph({
  title,
  points,
  lineColor,
  emptyMessage,
}: FunctionGraphProps) {
  const chartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let disposed = false
    const chartNode = chartRef.current

    async function renderChart() {
      if (!chartNode || points.length === 0) {
        return
      }

      const Plotly = (await import("plotly.js-basic-dist-min")).default as PlotlyInstance

      if (disposed || !chartNode) {
        return
      }

      const data: PlotlyTrace[] = [
        {
          x: points.map((point) => point.x),
          y: points.map((point) => point.y),
          type: "scatter",
          mode: "lines",
          line: {
            color: lineColor,
            width: 3,
          },
          hovertemplate: "x=%{x}<br>y=%{y}<extra></extra>",
        },
      ]

      const layout: PlotlyLayout = {
        autosize: true,
        font: {
          color: "#94a3b8",
        },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        margin: { l: 48, r: 16, t: 16, b: 48 },
        xaxis: {
          title: { text: "x" },
          zerolinecolor: "rgba(148, 163, 184, 0.45)",
          gridcolor: "rgba(148, 163, 184, 0.18)",
        },
        yaxis: {
          title: { text: "y" },
          zerolinecolor: "rgba(148, 163, 184, 0.45)",
          gridcolor: "rgba(148, 163, 184, 0.18)",
        },
      }

      await Plotly.newPlot(chartNode, data, layout, {
        displayModeBar: false,
        responsive: true,
      })
    }

    renderChart()

    return () => {
      disposed = true

      if (chartNode) {
        void import("plotly.js-basic-dist-min").then((Plotly) => {
          ;(Plotly.default as PlotlyInstance).purge(chartNode)
        })
      }
    }
  }, [lineColor, points, title])

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {points.length === 0 ? (
        <div className="mt-4 flex h-80 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div ref={chartRef} className="mt-4 h-80 w-full" />
      )}
    </div>
  )
}
