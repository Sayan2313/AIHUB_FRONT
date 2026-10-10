import React from "react";
import ChatPlayground from "@/app/models/[name]/_components/ChatPlayground";
import {notFound} from "next/navigation";

type Props = {
    params: Promise<{ name: string }>;
};

export enum ModelGoodName{
    phi3 = "Phi Playground",
}

export default async function ModelOverview({params}: Props) {
    const name: string = (await params).name;
    const modelPlaygrounds: Record<string, React.ReactNode> = {
        "Phi": <ChatPlayground model_name="phi3" icon_path="/Phi.svg" description="Ultra fast text model"/>
    }

    return modelPlaygrounds[name] ?? notFound();
}
