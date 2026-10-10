export interface Model {
    name: string,
    summary: string,
    description: string,
    capabilities: string[],
    latency: "Low" | "High" | "Medium",
    price: string,
}
export interface ChatMessage{
    role: "assistant" | "user";
    text: string;
}
export interface ChatResponse{
    model_name: string,
    prompt: string,
    response: string,
}