import React from 'react'
import { Button } from '../ui/button'
import { FlaskConicalIcon } from 'lucide-react'
import { useExecuteWorkflow } from '@/features/workflows/hooks/use-workflow'

export default function ExecuteWorkflowButton({ workflowId }: { workflowId: string }) {
    const executeWorkflow = useExecuteWorkflow()
    return (
        <Button onClick={() => { executeWorkflow.mutate({ id: workflowId }) }} disabled={executeWorkflow.isPending}>
            <FlaskConicalIcon
                className='size-4'
            />
            Execute Workflow
        </Button>
    )
}
