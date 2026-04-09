import type { ModelOption } from "@/types/model"
const pricingSymbol:string = "\u20B9"
export const modelOptions: ModelOption[] = [
  {
    id: "function-approximation",
    name: "FuncFit",
    summary: "Built for approximate functions",
    description:
        "A good option for understanding how neural networks approximate function",
    capabilities: ["function"],
    latency: "Low",
    pricing: pricingSymbol + " 101",
    playgroundPath: "/playground/function-approximation",
  },
  {
    id: "senti",
    name: "Senti",
    summary: "Analyse Sentiments of given sentence",
    description:
        "Analyse given the given text, and return a sentiment label with confidence score",
    capabilities: ["text"],
    latency: "Low",
    pricing: pricingSymbol + "101",
    playgroundPath: "/playground/senti",
  },
  {
    id: "peak",
    name: "Peak",
    summary: "Fast responses for chats",
    description:
        "Optimized for quick turnaround when users want simple answers, brainstorming, or everyday assistant flows.",
    capabilities: ["text"],
    latency: "Low",
    pricing: pricingSymbol + "101",
  },

]
