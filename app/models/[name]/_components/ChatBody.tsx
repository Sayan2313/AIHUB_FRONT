import {ChatMessage} from "@/types/models";
import {Bot, User} from "lucide-react";
import {Ref} from "react";


export default function ChatBody({messages, isLoading, messagesEndRef}: {
    messages: ChatMessage[],
    isLoading: boolean,
    messagesEndRef: Ref<HTMLDivElement>
}) {

    return (
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-3xl space-y-4">
                {messages.map((m, i) => {
                    const isAssistant = m.role === "assistant";

                    return (
                        <div
                            key={i}
                            className={`flex w-full items-end gap-2.5 ${
                                isAssistant ? "justify-start" : "justify-end"
                            }`}
                        >
                            {/* Assistant Avatar */}
                            {isAssistant && (
                                <div
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                    <Bot size={18}/>
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div
                                className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm sm:text-base leading-relaxed wrap-break-word whitespace-pre-wrap ${
                                    isAssistant
                                        ? "rounded-bl-xs border border-border/50 bg-card text-card-foreground shadow-xs"
                                        : "rounded-br-xs bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-sm"
                                }`}
                            >
                                {m.text}
                            </div>

                            {/* User Avatar */}
                            {!isAssistant && (
                                <div
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-foreground">
                                    <User size={18}/>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Loading Indicator Bubble */}
                {isLoading && (
                    <div className="flex w-full items-end justify-start gap-2.5">
                        <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            <Bot size={18}/>
                        </div>
                        <div className="rounded-2xl rounded-bl-xs border border-border/50 bg-card px-4 py-3 shadow-xs">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.3s]"/>
                                <span
                                    className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]"/>
                                <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"/>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef}/>
            </div>
        </div>
    );
}