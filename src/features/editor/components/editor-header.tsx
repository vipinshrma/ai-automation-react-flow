'use client'

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SaveIcon, Loader2 } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useSuspenseWorkflow, useUpdateWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflow"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { useAtomValue } from 'jotai'
import { editorAtom } from "../store/atom"

export const EditorSaveButton = ({ onSave, isSaving, workflowId }: { onSave?: () => void, isSaving?: boolean, workflowId: string }) => {
    const editor = useAtomValue(editorAtom)
    const saveWorkflow = useUpdateWorkflow()

    const handleSave = () => {
        if (!editor) return;
        const nodes = editor.getNodes()
        const edges = editor.getEdges()
        saveWorkflow.mutate({
            id: workflowId,
            nodes,
            edges
        })
    }

    return <div className="ml-auto">
        <Button
            size='sm'
            onClick={handleSave}
            disabled={isSaving || saveWorkflow.isPending}
        >
            <SaveIcon className="size-4" />
            {isSaving ? 'Saving...' : 'Save'}
        </Button>
    </div>
}

export const EditorBreadCrumbs = ({ workflowId }: { workflowId: string }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/workflows">Workflows</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <EditorNameInput workflowId={workflowId} />
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId)
    const updateWorkflow = useUpdateWorkflowName()
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(workflow?.name || '')

    const handleSave = () => {
        if (name.trim() && name !== workflow?.name) {
            updateWorkflow.mutate({ id: workflowId, name: name.trim() })
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setName(workflow?.name || '')
            setIsEditing(false)
        }
    }


    return (
        <BreadcrumbItem className="flex items-center gap-2">
            {isEditing ? (
                <>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="h-6 w-auto min-w-[200px]"
                    />
                    <Button
                        size="sm"
                        onClick={() => {
                            handleSave()
                            setIsEditing(false)
                        }}
                        disabled={updateWorkflow.isPending}
                        className="h-6 px-2"
                    >
                        {updateWorkflow.isPending ? (
                            <Loader2 className="size-3 animate-spin" />
                        ) : (
                            <SaveIcon className="size-3" />
                        )}
                        {updateWorkflow.isPending ? 'Saving...' : 'Save'}
                    </Button>
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <BreadcrumbPage
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer hover:text-foreground"
                    >
                        {workflow?.name || 'Untitled'}
                    </BreadcrumbPage>
                    {updateWorkflow.isPending && (
                        <Loader2 className="size-3 animate-spin text-muted-foreground" />
                    )}
                </div>
            )}
        </BreadcrumbItem>
    )
}

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
    return (
        <header className="flex h-14 shrink-4 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger />
            <div
                className="flex flex-row items-center justify-between gap-x-4 w-full"
            >
                <EditorBreadCrumbs workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    )
}
