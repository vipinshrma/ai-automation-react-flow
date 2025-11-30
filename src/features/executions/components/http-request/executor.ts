import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from 'ky';
import Handlebars from 'handlebars';
type HTTPRequestData = {
    variableName: string
    endPoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;

}

Handlebars.registerHelper('json', (context: any) => {
    const stringified = JSON.stringify(context,null,2);
    return new Handlebars.SafeString(stringified);
});

export const httpRequestExecutor: NodeExecutor<HTTPRequestData> = async ({ data, nodeId, context, step }) => {
    if (!data.endPoint) {
        //TODO: publish error state for http Request
        throw new NonRetriableError('End point is required for HTTP Request')
    }
    if (!data.variableName) {
        //TODO: publish error state for http Request
        throw new NonRetriableError('Variable name is required for HTTP Request')
    }
    if(!data.method){
        //TODO: publish error state for http Request
        throw new NonRetriableError('Method is required for HTTP Request')
    }
    const result = await step.run('http-request', async () => {
        const method = data.method;
        const endPoint = Handlebars.compile(data.endPoint)(context);
        const options: KyOptions = { method }
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            const body = Handlebars.compile(data.body || "{}")(context);
            options.body = body;
            options.headers = {
                'Content-Type': 'application/json',
            }
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
            [data.variableName]: {
                httpResponse: {
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData
                }
            }
        }
    })
    return result;
}
