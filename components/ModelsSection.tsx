import { modelOptions } from "@/lib/models"
import { ModelCard } from "@/components/ModelCard"
import { TypewriterText } from "@/components/TypewriterText"

export function ModelsSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
          <TypewriterText text="Explore Our Models" />
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modelOptions.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </section>
  )
}
