'use client'

import { NodeSelector } from "@/components/node-selector"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { memo, useState } from "react"

export const AddNodeButton = memo(()=>{
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = () => setIsOpen(!isOpen)
    
    return (
       <NodeSelector open={isOpen} onOpenChange={handleOpen}>
         <Button size='icon' variant='outline' className="bg-background">
            <PlusIcon/>
        </Button>
       </NodeSelector>
    )
})

AddNodeButton.displayName = 'AddNodeButton'