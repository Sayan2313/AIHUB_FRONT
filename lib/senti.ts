import type { SentimentRequest } from "@/types/senti-playground"

export const sentiApiPath = process.env.NEXT_PUBLIC_SENTI_API_PATH ?? "/api/sentiment_analysis/"

export const sentiSamplePrompts = [
  "I love how fast and intuitive this product feels.",
  "The movie started slowly, but the ending was surprisingly good.",
]

// Keep all accepted FastAPI BaseModel keys in one place.
export function buildSentimentRequest(inputText: string): SentimentRequest {
  return {
    text: inputText,
    input_text: inputText,
    Input_text: inputText,
  }
}
