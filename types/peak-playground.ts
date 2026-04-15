export interface PeakPrediction {
  Input_text: string
  response: string
  trainTimeMs?: number | null
}

export interface PeakResponse {
  predicted?: PeakPrediction
}

export interface PeakRequest {
  text: string
  model_size: "small" | "medium" | "large"
}
