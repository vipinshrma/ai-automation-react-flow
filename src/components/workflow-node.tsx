import { SettingsIcon, TrashIcon } from "lucide-react";
import { NodeToolbar, Position } from '@xyflow/react'
import { Button } from "./ui/button";


interface WorkflowsNodeProps {
    children: React.ReactNode;
    showToolbar?: boolean;
    onDelete?: () => void;
    onSettings?: () => void;
    name?: string,
    description?: string
}


export function WorkflowNode({ showToolbar = false, onSettings, onDelete, name, description, children }: WorkflowsNodeProps) {
    return (
        <>
            {
                showToolbar && (
                    <NodeToolbar
                    >
                        <Button size='sm' variant='ghost' onClick={onSettings}>
                            <SettingsIcon className="size-4" />
                        </Button>
                        <Button size='sm' variant='ghost' onClick={onDelete}>
                            <TrashIcon className="size-4" />
                        </Button>
                    </NodeToolbar>
                )
            }
            {children}
            {name && (
                <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className="max-w-[200px] text-center"
                >
                    <p className="font-medium">{name}</p>
                    {description && <p className="text-sm text-muted-foreground truncate">{description}</p>}
                </NodeToolbar>
            )}
        </>
    )
}