import type { PeakRequest } from "@/types/peak-playground"

export const peakApiPath = "/api/peak"

export const peakSamplePrompts = [
  "Hello, how can you help me today?",
  "What are you capable of?",
]

export function buildPeakRequest(inputText: string, modelSize: "small" | "medium" | "large" = "small"): PeakRequest {
  return {
    model_size: modelSize,
    text: inputText,
  }
}
