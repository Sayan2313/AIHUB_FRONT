import {getModelsInfo} from "@/services/api-client";
import ModelsContent from "@/app/models/_components/ModelsContent";
import {notFound} from "next/navigation";
import {Model} from "@/types/models";


async function fetchModels(): Promise<Model[] | null> {
    try {
        const data: Model[] = await getModelsInfo();
        if (!data || data.length === 0) {
            return null;
        } else {
            return data;
        }
    } catch (error) {
        console.error(error);
        return null
    }
}

export default async function ModelsPage() {
    const models = await fetchModels();

    if (!models) {
        notFound()
    } else {
        return <ModelsContent models={models}/>
    }
}

