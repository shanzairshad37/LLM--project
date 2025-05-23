import axios from "axios";
import {useMutation} from "@tanstack/react-query";


interface RequestData {
    prompt: string;
}

interface ResponseData {
    message: string;
}
async function getPromptResult(data: RequestData): Promise<ResponseData> {
    try {
        const response = await axios.post(
            `http://127.0.0.1:5000/generate`,
            data
        )
        return response.data;
    }
    catch (error) {
        console.error(error)
        throw error;
    }
}

export function useLLM () {
    return useMutation<ResponseData, unknown, RequestData>({
        mutationFn:  getPromptResult,
        mutationKey: ["getPromptResult"],
    })
}