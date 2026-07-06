<script lang="ts">
    import NavFooter from '$lib/components/NavFooter.svelte';
    import NavMain from '$lib/components/NavMain.svelte';
    import NavUser from '$lib/components/NavUser.svelte';
    import {
        Sidebar,
        SidebarContent,
        SidebarFooter,
        SidebarHeader,
        SidebarMenu,
        SidebarMenuButton,
        SidebarMenuItem,
        SidebarSeparator,
        useSidebar,
    } from '$lib/components/ui/sidebar';
    import { type NavItem, type UserMenuItem } from '$lib/types';
    // Link: use native <a> tags
    import { LayoutGrid, Headset, ArrowDownToLine, Wallet, Users, Newspaper, Calendar, TrendingUp, Shield, Sparkles, ArrowUpToLine } from 'lucide-svelte';
    import AppLogo from './AppLogo.svelte';
    import { USER } from '$lib/store';
    import Promotionalbanner from './user/Promotionalbanner.svelte';
    import { formatCurrency } from '$lib/utils';
    import { isCompanyUser } from '$lib/isAdmin.svelte';

    const sidebar = useSidebar();

    const customerMenuItems: UserMenuItem[] = [
        {
            menuGroup: 'Overview',
            items: [
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                    icon: LayoutGrid,
                },
                {
                    title: 'Portfolio',
                    href: '/investments',
                    icon: TrendingUp,
                },
            ],
        },
        {
            menuGroup: 'Finance',
            items: [
                {
                    title: 'Deposit',
                    href: '/deposit',
                    icon: ArrowUpToLine,
                },
                {
                    title: 'Withdraw',
                    href: '/withdrawals',
                    icon: ArrowDownToLine,
                },
                {
                    title: 'Wallets',
                    href: '/wallets',
                    icon: Wallet,
                },
            ],
        },
        {
            menuGroup: 'Invest',
            items: [
                {
                    title: 'Explore Plans',
                    href: '/plans',
                    icon: Sparkles,
                },
                {
                    title: 'Invite & Earn',
                    href: '/referrals',
                    icon: Users,
                },
            ],
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'News',
            href: '/news',
            icon: Newspaper,
        },
        {
            title: 'Support',
            href: '/help',
            icon: Headset,
        },
    ];
</script>

<Sidebar collapsible="icon" variant="inset">
    <SidebarHeader>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                    <a href="/dashboard" class="flex items-center gap-2">
                        <AppLogo />
                    </a>
                </SidebarMenuButton>
            </SidebarMenuItem>

            {#if $isCompanyUser}
                <SidebarMenuItem>
                    {#if sidebar.state === 'expanded'}
                        <div class="flex items-center gap-2 rounded-lg bg-primary/5 dark:bg-primary/10 px-2.5 py-1.5">
                            <Shield size={14} class="text-primary" />
                            <span class="text-xs font-semibold tracking-wider text-primary">CORPORATE</span>
                        </div>
                    {:else}
                        <div class="flex items-center justify-center rounded-md bg-primary/5 dark:bg-primary/10 p-1">
                            <Shield size={14} class="text-primary" />
                        </div>
                    {/if}
                </SidebarMenuItem>
                <SidebarSeparator />
            {/if}
        </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
        <NavMain items={customerMenuItems} />
    </SidebarContent>

    <SidebarFooter>
        {#if sidebar.state === 'expanded'}
            <Promotionalbanner
                href="#"
                referralBonus={1000}
                title="Refer & Earn"
                description={`Earn ${formatCurrency(1000)} for every invite.`}
                linkText="Start earning"
            />
        {/if}

        {#if sidebar.state === 'expanded'}
            <div class="flex items-center gap-2">
                <span class="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{$USER.group}</span>
            </div>
        {/if}

        <NavFooter items={footerNavItems} class="mt-auto" />

        <SidebarSeparator />

        <NavUser />
    </SidebarFooter>
</Sidebar>
