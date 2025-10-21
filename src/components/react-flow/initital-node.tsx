import { PlusIcon } from "lucide-react";
import { PlaceholderNode } from "./placeholder-node";
import { memo } from "react";
import type { NodeProps } from '@xyflow/react'
import { WorkflowNode } from "../workflow-node";

export const InitialNode = memo((props: NodeProps) => {
    return <WorkflowNode>
        <PlaceholderNode {...props}>
            <div className="cursor-pointer flex items-center justify-center">
                <PlusIcon className="size-4" />
            </div>
        </PlaceholderNode>
    </WorkflowNode>
})

InitialNode.displayName = 'InitialNode'