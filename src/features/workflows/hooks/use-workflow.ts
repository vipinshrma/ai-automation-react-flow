import { trpc } from './../../../trpc/server';
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowsParams } from './use-workflows-params';

export const useSuspenseWorkflows = () => {
    const [params] = useWorkflowsParams()
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params))
}

export const useCreateWorkflow = () => {
    // const [params] = useWorkflowsParams()
    const trpc = useTRPC();
    const queryClient = useQueryClient()
    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`Workflow ${data?.name} created successfully`)
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    }))
}

export const useUpdateWorkflowName = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient()
    return useMutation(trpc.workflows.updateName.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`Workflow ${data?.name} updated successfully`)
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
            if(data?.id) {
                queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({id: data.id}))
            }
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    }))
}

export const useRemoveWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient()
    return useMutation(trpc.workflows.remove.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`${data?.name} removed successfully`)
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    }))
}

export const useSuspenseWorkflow = (id:string)=>{
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id}))
}
