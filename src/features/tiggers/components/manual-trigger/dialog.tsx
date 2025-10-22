import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void

}

export const MannualTriaggerDialog = ({ open, onOpenChange }: Props) => {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Manual Trigger
                    </DialogTitle>
                    <DialogDescription>
                        Configure settings for the manual trigger mode
                    </DialogDescription>
                </DialogHeader>
                <div className='py-4'>
                    <p className="text-sm text-muted-foreground">Used to manually execute the workflow,no configuration available </p>
                </div>
            </DialogContent>

        </Dialog>
    )
}