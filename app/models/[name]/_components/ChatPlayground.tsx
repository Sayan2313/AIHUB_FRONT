"use client";

import ChatHeader from "@/app/models/[name]/_components/ChatHeader";
import useChat from "@/hooks/use-chat";
import ChatBody from "@/app/models/[name]/_components/ChatBody";
import ChatInput from "@/app/models/[name]/_components/ChatInput";


export default function ChatPlayground({model_name, icon_path, description}: {
    model_name: string,
    icon_path: string,
    description: string
}) {

    const {
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
    } = useChat()

    return (
        <div className="flex flex-col w-full h-[calc(100dvh-4rem)] overflow-hidden bg-background text-foreground ">
            <ChatHeader model_name={model_name} icon_path={icon_path} description={description} />
            <ChatBody messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef}/>
            <ChatInput model_name={model_name} input={input} setInput={setInput} isLoading={isLoading}
                       selectedFile={selectedFile} setSelectedFile={setSelectedFile}
                       fileInputRef={fileInputRef} handleFileChange={handleFileChange} send={send}/>
        </div>
    );
}