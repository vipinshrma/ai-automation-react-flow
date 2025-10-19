import { ChevronLeftIcon, ChevronRightIcon, PlugIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";

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

interface EntitySearchProps {
    value: string,
    onChange: (value: string) => void;
    placeholder?: string
}

export const EntitySearch = ({ value, onChange, placeholder = 'search' }: EntitySearchProps) => {
    return (
        <div className="relative ml-auto">
            <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
                className='max-w-[200px] bg-background shadow-none border-border pl-8'
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}


interface EntityPaginationProps {
    page: number,
    total: number,
    onPageChange: (page: number) => void;
    disabled?: boolean
}

export const EntityPagination = ({ page, total, onPageChange,disabled }: EntityPaginationProps) => {
    return (
        <div className="flex items-center justify-between gap-x-2">
          <div  className="flex-1 text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 10)}</div>
          <div className="flex  items-center justify-end space-x-2 py-4">
            <Button  onClick={() => onPageChange(Math.max(page - 1, 1))} variant='outline' size='sm' disabled={disabled || page === 1}>
                <ChevronLeftIcon className="size-3.5" />
            </Button>
            <Button onClick={() => onPageChange(Math.min(page + 1, Math.ceil(total / 10)))} variant='outline' size='sm' disabled={disabled || total === 0 || page === Math.ceil(total / 10)}>
                <ChevronRightIcon className="size-3.5" />
            </Button>
          </div>
        </div>
    )
}
 