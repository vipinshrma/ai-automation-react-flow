import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MannualTriaggerDialog } from "./dialog";

export const MannualTriggerNode = memo((node: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const NodeStatus = 'initial'
    const handleOpenSettings = () => setDialogOpen(dialogOpen)
    return (
        <>
            <BaseTriggerNode {...node}
                Icon={MousePointerIcon}
                name="Manual Trigger"
                description="Manual Trigger"
                onSettings={handleOpenSettings}
                onDoubleClick={() => { }}
                status={NodeStatus}
            />
            <MannualTriaggerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </>
    )
})