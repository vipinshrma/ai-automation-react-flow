import { InitialNode } from '@/components/react-flow/initital-node';
import { HttpRequestNode } from '@/features/executions/components/http-request/node';
import { MannualTriggerNode } from '@/features/tiggers/components/manual-trigger/node';
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from '@xyflow/react'
export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANNUAL_TRIGGER]: MannualTriggerNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents