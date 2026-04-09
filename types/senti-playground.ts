export interface SentimentPrediction {
  Input_text: string
  label: string
  score: number
  trainTimeMs?: number | null
}

export interface SentimentResponse {
  predicted?: SentimentPrediction
}

export interface SentimentRequest {
  text: string
  input_text: string
  Input_text: string
}
