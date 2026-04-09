import type { ModelOption } from "@/types/model"
const pricingSymbol:string = "\u20B9"
export const modelOptions: ModelOption[] = [
  {
    id: "function-approximation",
    name: "Function-approximation",
    summary: "Built for approximate functions",
    description:
        "A good option for understanding how neural networks approximate function",
    capabilities: ["function"],
    latency: "Low",
    pricing: pricingSymbol + "101",
    playgroundPath: "/playground/function-approximation",
    featured: true
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
  {
    id: "insight-pro",
    name: "Insight Pro",
    summary: "Best for long-form reasoning and detailed answers.",
    description:
      "Use this model when users need reliable multi-step analysis, summaries, and research-style responses.",
    capabilities: ["text"],
    latency: "Medium",
    pricing: pricingSymbol + "101",
  },

]
