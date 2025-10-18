import { UpgradeModal } from '@/components/upgrade-modal'
import { TRPCClientError } from '@trpc/client'
import { useState } from 'react'

interface UseUpgradeModalReturn {
    modal: React.ReactNode
    handleError: (error: unknown) => void
}

export const useUpgradeModal = (): UseUpgradeModalReturn => {
    const [open, setOpen] = useState(false)
    const handleError = (error: unknown) => {
        if (error instanceof TRPCClientError) {
            if (error.data?.code === 'FORBIDDEN') {
                setOpen(true)
            }
        }
    }
    const modal = <UpgradeModal open={open} onOpenChange={setOpen} />

    return {
        modal,
        handleError
    }
}