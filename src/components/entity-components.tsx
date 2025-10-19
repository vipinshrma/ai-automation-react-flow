import { AlertTriangleIcon, ChevronLeftIcon, ChevronRightIcon, Loader2Icon, MoreVerticalIcon, PackageOpenIcon, PlugIcon, SearchIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Spinner } from "./ui/spinner";

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

export const EntityPagination = ({ page, total, onPageChange, disabled }: EntityPaginationProps) => {
    return (
        <div className="flex items-center justify-between gap-x-2">
            <div className="flex-1 text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 10)}</div>
            <div className="flex  items-center justify-end space-x-2 py-4">
                <Button onClick={() => onPageChange(Math.max(page - 1, 1))} variant='outline' size='sm' disabled={disabled || page === 1}>
                    <ChevronLeftIcon className="size-3.5" />
                </Button>
                <Button onClick={() => onPageChange(Math.min(page + 1, Math.ceil(total / 10)))} variant='outline' size='sm' disabled={disabled || total === 0 || page === Math.ceil(total / 10)}>
                    <ChevronRightIcon className="size-3.5" />
                </Button>
            </div>
        </div>
    )
}


interface StateViewProps {
    message?: string
}


export const LoadingView = ({ message }: StateViewProps) => {
    return <div className="flex items-center justify-center h-full flex-1 flex-col gap-y-4">
        <Loader2Icon className="size-6 animate-spin text-primary" />
        {
            !!message && <p className="text-sm text-muted-foreground">{message}</p>
        }

    </div>
}


export const ErrorView = ({ message }: StateViewProps) => {
    return <div className="flex items-center justify-center h-full flex-1 flex-col gap-y-4">
        <AlertTriangleIcon className="size-6  text-primary" />
        {
            !!message && <p className="text-sm text-muted-foreground">{message}</p>
        }

    </div>
}

interface EmptyViewProps extends StateViewProps {
    onNew?: () => void
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
    return <Empty className="border border-dashed bg-white">
        <EmptyHeader>
            <EmptyMedia variant='icon'>
                <PackageOpenIcon />
            </EmptyMedia>
        </EmptyHeader>
        <EmptyTitle>
            No Items
        </EmptyTitle>
        {
            !!message && <EmptyDescription>
                {message}
            </EmptyDescription>
        }
        {
            !!onNew && (
                <EmptyContent>
                    <Button onClick={onNew}>Add Item</Button>
                </EmptyContent>
            )
        }
    </Empty>
}

interface EntityListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode
    getKey?: (item: T, index: number) => string | number;
    emptyView?: React.ReactNode;
    className?: string
}

export function EntityList<T>({
    items,
    renderItem,
    getKey,
    emptyView,
    className
}: EntityListProps<T>) {
    if (items.length === 0 && emptyView) {
        return (
            <div className="flex-1 flex justify-center items-center">
                <div className="max-w-sm mx-auto">
                    {emptyView}
                </div>

            </div>
        )
    }
    return (
        <div className={cn('flex flex-col gap-y-4', className)}>
            {
                items.map((item, index) => (
                    <div key={getKey?.(item, index) || index}>
                        {renderItem(item, index)}
                    </div>
                ))
            }
        </div>
    )
}


interface EntityItemProps {
    href: string;
    title: string;
    subtitle?: React.ReactNode
    image?: React.ReactNode;
    actions?: React.ReactNode;
    onRemove?: () => void | Promise<void>
    isRemoving?: boolean;
    className?: string
}

export const EntityItem = ({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving,
    className
}: EntityItemProps) => {
    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        if (isRemoving || !onRemove) {
            return;
        }

        await onRemove()
    }
    return (
        <Link href={href} prefetch>
            <Card className={cn('p-4 shadow-none hover:shadow cursor-pointer', className, isRemoving && 'opacity-50 cursor-not-allowed')} >
                <CardContent className="flex flex-row items-center justify-between p-0">
                    <div className="flex items-center gap-3">
                        {image}
                        <div>
                            <CardTitle className="text-base font-medium">
                                {title}
                            </CardTitle>
                            {
                                !!subtitle && <CardDescription className="text-xs">
                                    {subtitle}
                                </CardDescription>
                            }
                        </div>
                    </div>

                    {
                        (actions || onRemove) && (
                            <div className="flex gap-x-4 items-center">
                                {actions}
                                {
                                    onRemove && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    size='icon'
                                                    variant='ghost'
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreVerticalIcon className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenuItem disabled={isRemoving} onClick={handleRemove}>
                                                    <div className="flex items-center gap-2">
                                                        {isRemoving ? (
                                                            <>
                                                                <Spinner className="size-4 text-center animate-spin text-primary" />
                                                                <span className="text-primary">Deleting...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <TrashIcon className="size-4 text-primary" />
                                                                <span className="text-primary">Delete</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )
                                }
                            </div>
                        )
                    }
                </CardContent>
            </Card>
        </Link>
    )
}