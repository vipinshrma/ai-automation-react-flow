'use client'

import { NodeProps, Position, useReactFlow } from '@xyflow/react'
import { Icon, type LucideIcon } from 'lucide-react'
import { BaseNode, BaseNodeContent } from '@/components/react-flow/base-node'
import { BaseHandle } from '@/components/react-flow/base-handle'
import { WorkflowNode } from '../../../components/workflow-node'
import { memo, ReactNode } from 'react'
import Image from 'next/image'
import { NodeStatusIndicator } from '@/components/react-flow/node-status-indicator'
import type { NodeStatus } from '@/components/react-flow/node-status-indicator'

interface BaseTriggerNodeProps extends NodeProps {
    Icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    onSettings?: () => void;
    onDoubleClick?: () => void;
    id: string
    status?:NodeStatus

}

export const BaseTriggerNode = memo(({ name, description, children, Icon, onSettings, onDoubleClick, id,status='initial' }: BaseTriggerNodeProps) => {
    const { setNodes, setEdges } = useReactFlow()
    // TOD: add delete method
    const handleDelete = () => {
        setNodes((currentNode) => {
            return currentNode.filter(node => node.id !== id)
        })
        setEdges((currentEdge) => {
            return currentEdge.filter(edge => edge.source !== id && edge.target !== id)
        })
    }
    return (
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSettings={onSettings}
            showToolbar

        >
            <NodeStatusIndicator
            status={status}
            variant='border'
            className='rounded-l-2xl'
            >
                <BaseNode status={status} onDoubleClick={onDoubleClick} className='rounded-l-2xl relative group'>
                    <BaseNodeContent>
                        {
                            typeof Icon === 'string' ? (<Image src={Icon} alt={name} width={16} height={16} />) : <Icon className="size-5 text-muted-foreground" />
                        }
                        {children}
                        <BaseHandle type="source" position={Position.Right} id='source-1' />
                    </BaseNodeContent>
                </BaseNode>
            </NodeStatusIndicator>


        </WorkflowNode>
    )
})

BaseTriggerNode.displayName = 'BaseTriggerNode'