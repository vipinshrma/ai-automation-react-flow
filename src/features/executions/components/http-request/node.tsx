import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-model";
import { Node, NodeProps, useReactFlow } from '@xyflow/react'
import { formSchema, HttpRequestDialog } from "./dialog";
import z from "zod";
type HTTPRequestNodeData = {
    endPoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
    [key: string]: unknown
}

type HTTPRequestNodeType = Node<HTTPRequestNodeData>

export const HttpRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {
    const nodeData = props.data;
    const description = nodeData.endPoint ? `${nodeData.method || 'GET'} ${nodeData.endPoint}` : 'Not Configured'
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenSettings = () => setDialogOpen(true)
    const {setNodes,setEdges} = useReactFlow()

    const onSubmit = (values:z.infer<typeof formSchema>)=>{
        setNodes((nodes=>{
            return nodes.map((node=>{
                if(node.id===props.id){
                    return {...node,data:{...node.data,...values}}
                }
                return node
            }))
        }))
    }

    const nodeStatus = 'initial'
    return (
        <>
            <HttpRequestDialog onSubmit={onSubmit} defaultBody={nodeData.body} defaultMethod={nodeData.method} defaultEndpoint={nodeData.endPoint} open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseExecutionNode {...props} id={props.id} Icon={GlobeIcon} name="HTTP Request" description={description} onSettings={handleOpenSettings} onDoubleClick={handleOpenSettings} status={nodeStatus} />
        </>
    )
})


HttpRequestNode.displayName = 'HttpRequestNode'