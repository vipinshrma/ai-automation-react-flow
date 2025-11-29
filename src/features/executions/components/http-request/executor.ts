import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from 'ky';
type HTTPRequestData = {
    endPoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
}

export const httpRequestExecutor: NodeExecutor<HTTPRequestData> = async ({ data, nodeId, context, step }) => {
    if (!data.endPoint) {
        //TODO: publish error state for http Request
        throw new NonRetriableError('End point is required for HTTP Request')
    }
    const result = await step.run('http-request', async () => {
        const method = data.method || 'GET';
        const endPoint = data.endPoint!;
        const options: KyOptions = { method }
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            options.body = data.body
        }
        const response = await ky(endPoint, options)
        const contentType = response.headers.get('content-type');
        let responseData = null;
        if (contentType?.includes('application/json')) {
            responseData = await response.json().catch(() => response.text)
        } else {
            responseData = await response.text()
        }
        return {
            ...context,
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData
            }
        }
    })
    return result;
}
