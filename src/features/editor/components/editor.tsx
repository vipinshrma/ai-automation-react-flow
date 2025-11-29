'use client'

import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflow"
import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge, NodeChange, EdgeChange, Connection, Background, Controls, MiniMap, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from 'jotai'
import { editorAtom } from "../store/atom";
import { NodeType } from "@/generated/prisma";
import ExecuteWorkflowButton from "@/components/execute-workflow/execute-workflow-button";
export const EditorLoading = () => {
    return <LoadingView message='Loading Editor' />
}

export const EditorError = () => {
    return <ErrorView message='Error loading Editor' />
}

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId)
    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);
    const setEditor = useSetAtom(editorAtom)
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );
    const hasMannualTrigger = useMemo(() => {
        return nodes?.some(node => node.type === NodeType.MANNUAL_TRIGGER)
    }, [nodes])
    return (
        <div className="size-full" >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                nodeTypes={nodeComponents}
                onInit={setEditor}
                proOptions={{
                    hideAttribution: true
                }}
                snapGrid={[10, 10]}
                snapToGrid
                panOnScroll
            // panOnDrag={false}
            // selectionOnDrag
            >
                <Background />
                <Controls />
                <MiniMap />
                <Panel position='top-right'>
                    <AddNodeButton />
                </Panel>
                {
                    hasMannualTrigger &&
                    <Panel position='bottom-center'>
                        <ExecuteWorkflowButton workflowId={workflowId} />
                    </Panel>
                }
            </ReactFlow>
        </div>
    )
}