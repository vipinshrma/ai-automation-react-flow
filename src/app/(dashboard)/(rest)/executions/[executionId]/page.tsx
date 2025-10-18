interface PageProps {
  params: {
    executionId: string
  }
}

 async function  Page({ params }: PageProps) {
    const { executionId } = await params
  return (
    <div>Execution page {executionId}</div>
  )
}

export default Page