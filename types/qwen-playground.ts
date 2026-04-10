export interface QwenPrediction {
  Input_text: string
  response: string
  trainTimeMs?: number | null
}

export interface QwenResponse {
  predicted?: QwenPrediction
}

export interface QwenRequest {
  text: string
}
