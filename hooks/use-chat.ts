import {useEffect, useRef, useState} from "react";
import {ChatMessage, ChatResponse} from "@/types/models";
import {postChatRequest} from "@/services/api-client";


export default function useChat() {
    const [input, setInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {role: "assistant", text: "Hello! How can I assist you today?"},
    ]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);


    // Auto-scroll when messages update or loading state changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages, isLoading]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        }
        e.target.value = "";
    };
    // Sends request to backend
    const send = async (model_name:string) => {
        if ((!input.trim() && !selectedFile) || isLoading) return;

        const userPrompt = input.trim();
        const fileToSend = selectedFile || null;

        setInput("");
        setSelectedFile(null); // Clear file

        setMessages((prev) => [
            ...prev,
            { role: "user", text: userPrompt}
        ]);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("model_name", model_name);
            formData.append("prompt", userPrompt);

            let chatResponse: ChatResponse;
            if(fileToSend) {
                formData.append("file",fileToSend);
                chatResponse = await postChatRequest(formData);
            }else{
                chatResponse = await postChatRequest(formData);
            }

            setMessages((prev) => [
                ...prev,
                {role: "assistant", text: chatResponse.response},
            ]);
        } catch (error) {
            console.error("Failed to generate response:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "Sorry, something went wrong. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };
    return {
        input,
        setInput ,
        isLoading,
        messages,
        messagesEndRef,
        selectedFile,
        setSelectedFile,
        fileInputRef,
        handleFileChange,
        send
    }
}