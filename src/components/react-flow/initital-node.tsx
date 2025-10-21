import { PlusIcon } from "lucide-react";
import { PlaceholderNode } from "./placeholder-node";
import { memo, useCallback, useState } from "react";
import type { NodeProps } from '@xyflow/react'
import { WorkflowNode } from "../workflow-node";
import { NodeSelector } from "../node-selector";

export const InitialNode = memo((props: NodeProps) => {
    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(() => {
        setOpen(!open);
    }, [open]);


    return <NodeSelector open={open} onOpenChange={handleOpen}>
        <WorkflowNode>
            <PlaceholderNode {...props} onClick={() => setOpen(true)}>
                <div className="cursor-pointer flex items-center justify-center">
                    <PlusIcon className="size-4" />
                </div>
            </PlaceholderNode>
        </WorkflowNode>
    </NodeSelector>
})

InitialNode.displayName = 'InitialNode'