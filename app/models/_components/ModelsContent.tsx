"use client"

import TypeWriter from "@/components/custom-ui/TypeWriter";
import ModelCard from "@/components/custom-ui/ModelCard";
import {Model} from "@/types/models";

export default function ModelsContent({models} : { models: Model[] }) {
    return (
        <main className="min-h-screen">
            <div className="flex justify-center items-center my-5">
                <TypeWriter text="Explore Our Models" speed={75}/>
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {models.map((model, index) => (
                    <ModelCard key={index} name={model.name} summary={model.summary}
                               description={model.description} price={model.price} capabilities={model.capabilities}
                               latency={model.latency}/>
                ))}
            </div>
        </main>
    );
}