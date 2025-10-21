'use client'

import { NodeProps, Position } from '@xyflow/react'
import { Icon, type LucideIcon } from 'lucide-react'
import { BaseNode, BaseNodeContent } from '@/components/react-flow/base-node'
import { BaseHandle } from '@/components/react-flow/base-handle'
import { WorkflowNode } from '../../../components/workflow-node'
import { memo, ReactNode } from 'react'
import Image from 'next/image'


interface BaseExecutionNodeProps extends NodeProps {
    Icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    onSettings?: () => void;
    onDoubleClick?: () => void;

}

export const BaseExecutionNode = memo(({ name, description, children, Icon, onSettings, onDoubleClick }: BaseExecutionNodeProps) => {
    // TOD: add delete method
    const handleDelete = () => {

    }
    return (
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSettings={onSettings}
            showToolbar

        >
            {/* TODO: Wrap within NodeStatusIndicator*/}
            <BaseNode onDoubleClick={onDoubleClick}>
                <BaseNodeContent>
                    {
                        typeof Icon === 'string' ? (<Image src={Icon} alt={name} width={16} height={16} />) : <Icon className="size-5 text-muted-foreground" />
                    }
                    {children}
                    <BaseHandle type="target" position={Position.Left} id='target-1' />
                    <BaseHandle type="source" position={Position.Right} id='source-1' />
                </BaseNodeContent>
            </BaseNode>

        </WorkflowNode>
    )
})

BaseExecutionNode.displayName = 'BaseExecutionNode'