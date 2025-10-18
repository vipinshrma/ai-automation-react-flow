import { PlugIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

type EntityHeaderProps = {
    title?: string;
    description?: string;
    newButtonLabel?: string;
    disabled?: boolean;
    isCreating?: boolean;

} & (
        { onNew: () => void; newButtonHref?: never } | { newButtonHref: string, onNew?: never } | { onNew?: never; newButtonHref?: never }
    )



export const EntityHeader = ({
    title,
    description,
    newButtonLabel,
    disabled,
    isCreating,
    onNew,
    newButtonHref
}: EntityHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
                {
                    description && <p className="text-sm md:text-sm text-muted-foreground">{description}</p>
                }
            </div>
            {
                onNew && !newButtonHref && (
                    <Button onClick={onNew} disabled={isCreating || disabled} size={'sm'}>
                        <PlugIcon className="size-4" />
                        {newButtonLabel}
                    </Button>
                )
            }
            {
                !onNew && newButtonHref && (
                    <Button asChild >
                        <Link prefetch href={newButtonHref} >
                            <PlugIcon className="size-4" />
                            {newButtonLabel}
                        </Link>
                    </Button>
                )
            }
        </div>
    )
}

type EntityContainerProps = {
    children?: React.ReactNode;
    search?: React.ReactNode;
    header?: React.ReactNode;
    pagination?: React.ReactNode;

};


export const EntityContainer = ({ children, header, pagination, search }: EntityContainerProps) => {
    return <div className="p-4 md:px-10 md:py-6 h-full">
        <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
            {header}
            <div className="flex flex-col gap-y-4 h-full">
                {search}
                {children}
            </div>
            {pagination}
        </div>

    </div>
}