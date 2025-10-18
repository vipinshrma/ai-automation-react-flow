'use client'

import { EntityContainer, EntityHeader } from "@/components/entity-components"
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflow"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()
    return (
        <div>
            <p>
                {JSON.stringify(workflows.data, null, 2)}
            </p>
        </div>

    )
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const createWorkflow = useCreateWorkflow()
    const router = useRouter()
    const { modal, handleError } = useUpgradeModal()
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess:()=>{
                router.push(`/workflows/${createWorkflow.data?.id}`)
            },
            onError: (error => {
                handleError(error)
            })
        })
    }
    return (
        <>
            {modal}
            <EntityHeader
                title="Workflows"
                description="Manage your workflows"
                disabled={disabled}
                newButtonLabel="New Workflow"
                onNew={handleCreate}
                isCreating={createWorkflow.isPending}
            />
        </>
    )
}

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <EntityContainer
                header={<WorkflowsHeader />}
                search={<></>}
                pagination={<></>}
            >
                {children}

            </EntityContainer>
        </>
    )
}