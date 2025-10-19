import { WorkflowsContainer, WorkflowsList } from '@/features/workflows/components/workflows'
import { prefetchWorkflows } from '@/features/workflows/servers/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import { ErrorBoundary } from "react-error-boundary";

import React, { Suspense } from 'react'
import type { SearchParams } from 'nuqs';
import { workflowsParamsLoader } from '@/features/workflows/servers/params-loder';

type Props = {
  searchParams: Promise<SearchParams>;

}

async function Page({ searchParams }: Props) {
  await requireAuth()
  const params = await workflowsParamsLoader(searchParams)
  prefetchWorkflows(params)
  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          <Suspense fallback={<p>Loading...</p>}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>

  )
}

export default Page