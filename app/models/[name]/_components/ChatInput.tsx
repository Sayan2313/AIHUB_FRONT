import {FileText, Plus, Send, X} from "lucide-react";
import {ChangeEvent, Dispatch, RefObject, SetStateAction} from "react";

{/* Input Area */
}
export default function ChatInput({
                                      model_name,
                                      input,
                                      setInput,
                                      isLoading,
                                      selectedFile,
                                      setSelectedFile,
                                      fileInputRef,
                                      handleFileChange,
                                      send
                                  }: {
                                      model_name: string,
                                      input: string,
                                      setInput: Dispatch<SetStateAction<string>>,
                                      isLoading: boolean,
                                      selectedFile: File | null,
                                      setSelectedFile: Dispatch<SetStateAction<File | null>>,
                                      fileInputRef: RefObject<HTMLInputElement | null>,
                                      handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
                                      send: (model_name : string) => Promise<void>
                                  }
) {

    return (
        <footer className="shrink-0 border-t bg-background/50 p-4 backdrop-blur-xs">
            <div className="mx-auto max-w-3xl space-y-2">
                {/* ADD THIS PREVIEW BADGE */}
                {selectedFile && (
                    <div
                        className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs">
                        <FileText size={14} className="text-purple-500"/>
                        <span className="truncate max-w-50">{selectedFile.name}</span>
                        <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="hover:text-foreground text-muted-foreground"
                        >
                            <X size={14}/>
                        </button>
                    </div>
                )}
                <div className="flex items-center gap-2 rounded-2xl border bg-card p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-purple-500/20">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                        title="Add attachment"
                    >
                        <Plus size={20}/>
                    </button>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                send(model_name).then(r => r);
                            }
                        }}
                        placeholder={isLoading ? "Phi is typing..." : "Message Phi..."}
                        className="flex-1 bg-transparent px-2 py-1.5 text-sm sm:text-base outline-none placeholder:text-muted-foreground disabled:opacity-50"
                    />

                    <button
                        onClick={ ()=> send(model_name)}
                        disabled={(input.trim().length < 2) || isLoading}
                        className="rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 p-2 text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Send size={18}/>
                    </button>
                </div>

                <p className="mt-2 text-center text-sm text-muted-foreground">
                    AI can make mistakes. Verify important facts.
                </p>
            </div>
        </footer>
    );
}