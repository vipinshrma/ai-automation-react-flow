"use client"

import { useMemo, type ComponentType, type SVGProps } from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Clock, CreditCardIcon, GitBranch, KeyRound, LogOut, Settings2, StarIcon } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription"

type NavItem = {
    title: string
    href: string
    icon: ComponentType<SVGProps<SVGSVGElement>>,
    type?: 'button' | 'link',
    onClick?: () => void
    show?: boolean
}

const PRIMARY_NAV: NavItem[] = [
    {
        title: "Workflows",
        href: "/workflows",
        icon: GitBranch,
        show: true
    },
    {
        title: "Credentials",
        href: "/credentials",
        icon: KeyRound,
        show: true
    },
    {
        title: "Executions",
        href: "/executions",
        icon: Clock,
        show: true
    }

]



const isActivePath = (pathname: string, href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebar() {

    const pathname = usePathname()
    const router = useRouter()
    const {hasActiveSubscription,isLoading} = useHasActiveSubscription()
    
    const SECONDARY_NAV =useMemo(() => [
        {
            title: "Upgrade to Pro",
            href: "/upgrade",
            icon: StarIcon,
            type: 'button',
            onClick: () => {
               authClient.checkout({slug:'pro'})
            },
            show: !hasActiveSubscription && !isLoading
        },
        {
            title: "Billing Portal",
            href: "/billing",
            icon: CreditCardIcon,
            show: true,
            type:'button',
            onClick:()=>{
                authClient.customer.portal()
            }
            
        },
    ], [hasActiveSubscription,isLoading])

    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4">
                        <Link href="/" prefetch>
                            <Image width={30} height={30} src="/logo.svg" alt="AI Automation" className="size-8" />
                            <span className="font-semibold text-sm">AI Automation</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {PRIMARY_NAV.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActivePath(pathname, item.href)}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {SECONDARY_NAV?.filter((item)=>item.show).map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActivePath(pathname, item.href)}
                                        tooltip={item.title}
                                        className="gap-x-4 h-10 px-4"
                                    >
                                        {
                                            item?.type === 'button' ?   <div onClick={item.onClick}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </div> :  <Link href={item.href}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                        }
                                      
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    className="gap-x-4 h-10 px-4"
                                    type='button'
                                    onClick={() => {
                                        authClient.signOut({
                                            fetchOptions: {
                                                onSuccess: () => {
                                                    router.push("/login")
                                                }
                                            }
                                        })
                                    }}
                                >
                                    <div className="flex gap-x-4">
                                        <LogOut className="size-4" />
                                        <span>Sign Out</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar
