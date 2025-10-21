import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { BaseTriggerNode } from "../base-trigger-node";

export const MannualTriggerNode = memo((node:NodeProps)=>{
    return (
        <BaseTriggerNode {...node} Icon={MousePointerIcon} name="Manual Trigger" description="Manual Trigger" onSettings={() => { }} onDoubleClick={() => { }} />
    )
})