interface PageProps {
  params: {
    credentialId: string
  }
}

 async function  Page({ params }: PageProps) {
    const { credentialId } = await params
  return (
    <div>Credentials page {credentialId}</div>
  )
}

export default Page