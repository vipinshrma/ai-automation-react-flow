interface PageProps {
  params: {
    workflowId: string
  }
}

 async function  Page({ params }: PageProps) {
    const { workflowId } = await params
  return (
    <div>Workflow page {workflowId}</div>
  )
}

export default Page