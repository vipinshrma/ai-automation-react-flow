'use client'

import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components"
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflow"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"

export const WorkflowsSearch = ()=>{
    const [params,setParams] = useWorkflowsParams()
    const {searchValue,onSearchChange} = useEntitySearch({params,setParams})
    return <EntitySearch 
    value={searchValue}
    onChange={onSearchChange}

    />
}

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
            onSuccess:(data)=>{
                router.push(`/workflows/${data?.id}`)
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

export const WorkflowsPagination = ()=>{
    const [params,setParams] = useWorkflowsParams()
    const workflows  = useSuspenseWorkflows()
    return <EntityPagination
    disabled={workflows.isFetching}
    page={workflows.data.page}
    total={workflows.data?.totalPages}
    onPageChange={(page)=>setParams({
        ...params,
        page
    })}
    />
}

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <EntityContainer
                header={<WorkflowsHeader />}
                search={<WorkflowsSearch/>}
                pagination={<WorkflowsPagination/>}
            >
                {children}

            </EntityContainer>
        </>
    )
}