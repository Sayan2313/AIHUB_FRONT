// Allowed capability tags for each model card.
export type ModelCapability = "text" | "image" | "function"

export interface ModelOption {
  id: string
  name: string
  summary: string
  description: string
  // These values are rendered as badge tags in the UI.
  capabilities: ModelCapability[]
  latency: string
  pricing: string
  playgroundPath?: string
}
