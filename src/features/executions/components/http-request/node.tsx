import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-model";
import { Node, NodeProps } from '@xyflow/react'
type HTTPRequestNodeData = {
    endPoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
    [key: string]: unknown
}

type HTTPRequestNodeType = Node<HTTPRequestNodeData>

export const HttpRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {
    const nodeData = props.data as HTTPRequestNodeData
    const description = nodeData.endPoint ? `${nodeData.method || 'GET'} ${nodeData.endPoint}` : 'Not Configured'
    return (
        <>
            <BaseExecutionNode {...props} id={props.id} Icon={GlobeIcon} name="HTTP Request" description={description} onSettings={() => { }} onDoubleClick={() => { }} />
        </>
    )
})


HttpRequestNode.displayName = 'HttpRequestNode'