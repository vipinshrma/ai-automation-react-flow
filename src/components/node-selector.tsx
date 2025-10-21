import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { NodeType } from '@/generated/prisma'
import { Separator } from "./ui/separator";
import { GlobeIcon, MousePointerIcon, PlusIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { createId } from '@paralleldrive/cuid2'
export type NodeTypeOption = {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }> | string;
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANNUAL_TRIGGER,
        label: 'Manual Trigger',
        description: 'Trigger workflow manually',
        icon: MousePointerIcon
    }
]

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: 'HTTP Request',
        description: 'Make HTTP request',
        icon: GlobeIcon
    }
]

interface NodeSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode
}

export function NodeSelector({ children, open, onOpenChange }: NodeSelectorProps) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow()
    const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
        if (selection.type === NodeType.MANNUAL_TRIGGER) {
            const nodes = getNodes()
            const hasManualTrigger = nodes.some((node => node.type === NodeType.MANNUAL_TRIGGER))
            if (hasManualTrigger) {
                toast.error('Only One mannual trigger is allowed per workflow')
                return
            }
        }
        setNodes((nodes => {
            const hasInitialTrigger = nodes.some((node => node.type === NodeType.INITIAL))
            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2
            const flowPoisition = screenToFlowPosition({
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY + (Math.random() - 0.5) * 200
            })
            const newNode = {
                id: createId(),
                data: {},
                position: flowPoisition,
                type: selection?.type
            }
            if (hasInitialTrigger) {
                return [newNode]
            }
            return [...nodes, newNode]

        }))
        onOpenChange(false)

    }, [
        setNodes, getNodes, onOpenChange, screenToFlowPosition
    ])
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent side='right' className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>What triggers this workflow?</SheetTitle>
                    <SheetDescription>
                        A trigger is a step that starts your workfloe
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {
                        triggerNodes?.map((nodeType) => {
                            const Icon = nodeType.icon
                            return (
                                <div key={nodeType.type} onClick={() => handleNodeSelect(nodeType)} className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary" >
                                    <div className="flex items-center gap-6 w-full overflow-hidden">
                                        {
                                            typeof Icon === 'string' ? (
                                                <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm" />
                                            ) : (
                                                <Icon className="size-5" />
                                            )
                                        }
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-medium text-sm">
                                                {nodeType.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {nodeType.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <Separator />

                    {
                        executionNodes?.map((nodeType) => {
                            const Icon = nodeType.icon
                            return (
                                <div key={nodeType.type} onClick={() => handleNodeSelect(nodeType)} className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary">
                                    <div className="flex items-center gap-6 w-full overflow-hidden">
                                        {
                                            typeof Icon === 'string' ? (
                                                <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm" />
                                            ) : (
                                                <Icon className="size-5" />
                                            )
                                        }
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-medium text-sm">
                                                {nodeType.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {nodeType.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </SheetContent>
        </Sheet>
    )
}