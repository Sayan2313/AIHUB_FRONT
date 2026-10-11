'use server'

import {ChatResponse, Model} from "@/types/models";

const API_URL = process.env.API_INTERNAL_URL? process.env.API_INTERNAL_URL : process.env.NEXT_PUBLIC_API_URL

export async function getModelsInfo() : Promise<Model[]> {
    const res: Response = await fetch(API_URL + "/api/models/info");
    if (!res.ok) {
        throw new Error(`res.status`);
    }
    const data = await res.json();
    return data.models;
}

export async function postChatRequest(chatRequest: FormData) : Promise<ChatResponse>
{
    const res: Response = await fetch(API_URL + "/api/models/llm",
        {
            method:'POST',
            credentials : "include",
            body: chatRequest
        });
    console.log(API_URL);
    if (!res.ok) {
        throw new Error(`${res.status}`);
    }
    return await res.json() as ChatResponse;
}