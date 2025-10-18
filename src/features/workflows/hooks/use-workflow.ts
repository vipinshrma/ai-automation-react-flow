import { trpc } from './../../../trpc/server';
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions())
}

export const useCreateWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient()
    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`Workflow ${data?.name} created successfully`)
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions())
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    }))
}