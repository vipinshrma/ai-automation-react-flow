'use client'

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components"
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflow"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"
import type { Workflow } from '@/generated/prisma'
import { WorkflowIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams()
    const { searchValue, onSearchChange } = useEntitySearch({ params, setParams })
    return <EntitySearch
        value={searchValue}
        onChange={onSearchChange}

    />
}

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()
    return <EntityList
        items={workflows.data.items}
        getKey={(workflow) => workflow.id}
        renderItem={(workflow, index) => (
            <WorkflowItem data={workflow} />
        )}
        emptyView={<WorkflowsEmpty />}
    />
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const createWorkflow = useCreateWorkflow()
    const router = useRouter()
    const { modal, handleError } = useUpgradeModal()
    const handleCreate = () => {
        createWorkflow.mutate({ name: '' }, {
            onSuccess: (data) => {
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

export const WorkflowsPagination = () => {
    const [params, setParams] = useWorkflowsParams()
    const workflows = useSuspenseWorkflows()
    return <EntityPagination
        disabled={workflows.isFetching}
        page={workflows.data.page}
        total={workflows.data?.totalPages}
        onPageChange={(page) => setParams({
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
                search={<WorkflowsSearch />}
                pagination={<WorkflowsPagination />}
            >
                {children}

            </EntityContainer>
        </>
    )
}
export const WorkflowsLoading = () => {
    return <LoadingView message="Loading Workflows" />
}


export const WorkflowsError = () => {
    return <ErrorView message="Loading Workflows" />
}


export const WorkflowsEmpty = () => {
    const createWorkflow = useCreateWorkflow()
    const { modal, handleError } = useUpgradeModal()
    const [params] = useWorkflowsParams()
    const handleCreate = () => {
        createWorkflow.mutate({ name: params.search }, {
            onError: (error => {
                handleError(error)
            })
        })
    }
    return <>
        {modal}
        <EmptyView
            message="You haven't created any workflows yet. Get started by creating your first workflow"
            onNew={handleCreate}
        />
    </>
}

export const WorkflowItem = ({ data }: { data: Workflow }) => {
    const { mutate: removeWorkflow, isPending } = useRemoveWorkflow()
    const handleRemove = () => {
        removeWorkflow({ id: data.id })
    }
    return <EntityItem
        href={`/workflow/${data.id}`}
        title={data.name}
        subtitle={
            <>
                Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })} {" "}
                &bull; Created {" "}
                {formatDistanceToNow(data.createdAt, { addSuffix: true })}
            </>
        }
        image={
            <div className="size-8 flex items-center justify-center">
                <WorkflowIcon className="size-5 text-muted-foreground" />
            </div>
        }
        onRemove={handleRemove}
        isRemoving={isPending}
    />
}