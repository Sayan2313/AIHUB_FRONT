import type { QwenRequest } from "@/types/qwen-playground"

export const qwenApiPath = process.env.NEXT_PUBLIC_QWEN_API_PATH ?? "/api/qwen/"

export const qwenSamplePrompts = [
  "Hello, how are you?",
]

export function buildQwenRequest(inputText: string): QwenRequest {
  return {
    text: inputText,
  }
}
