import Link from "next/link"
import type { ModelOption } from "@/types/model"

// Maps capability values from the type layer to the badge text shown in the UI.
const capabilityLabels: Record<ModelOption["capabilities"][number], string> = {
  text: "Text",
  image: "Image",
  function: "Function",
}

interface ModelCardProps {
  model: ModelOption
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {model.featured ? "Featured Model" : "Model"}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {model.name}
            </h3>
          </div>
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
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
          <Link
            href={model.playgroundPath}
            className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-90"
          >
            Try model
          </Link>
        ) : (
          <button
            type="button"
            className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-90"
          >
            Try model
          </button>
        )}
      </div>
    </article>
  )
}
