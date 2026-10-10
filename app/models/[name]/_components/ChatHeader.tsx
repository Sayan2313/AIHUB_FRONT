import Image from "next/image";
import {ModelGoodName} from "@/app/models/[name]/page";


{/* Sticky Header */
}
export default function ChatHeader({model_name, icon_path, description}: {
    model_name: string,
    icon_path: string,
    description: string
}) {
    return (
        <header className="sticky border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-3.5 shadow-sm">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-3xl overflow-hidden">
                        <Image
                            src={icon_path}
                            alt={model_name}
                            width={35}
                            height={35}
                            priority
                        />
                    </div>
                    <div>
                        <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                            {ModelGoodName[model_name as keyof typeof ModelGoodName]}
                        </h1>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"/> Online </span>
            </div>
        </header>
    );
}