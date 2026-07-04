<script lang="ts">
    import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuBadge } from '@/components/ui/sidebar';
    import type { UserMenuItem } from '@/types';
    import { Link, page } from '@inertiajs/svelte';

    interface Props {
        items: UserMenuItem[];
    }

    let { items = [] }: Props = $props();
</script>

<SidebarGroup class="px-2 py-0">
    {#each items as item (item.menuGroup)}
        <SidebarGroupLabel>{item.menuGroup}</SidebarGroupLabel>
        <SidebarMenu>
            {#each item.items as subItem (subItem.title)}
                <SidebarMenuItem>
                    <Link href={subItem.href} class="relative block w-full">
                        <SidebarMenuButton class="!cursor-pointer" isActive={subItem.href === $page.url}>
                            {#snippet tooltipContent()}
                                {subItem.title}
                            {/snippet}
                            {#if subItem.icon}
                                {@const Icon = subItem.icon}
                                <Icon class="h-4 w-4 shrink-0" />
                            {/if}
                            <span>{subItem.title}</span>
                        </SidebarMenuButton>
                        {#if subItem.counter !== undefined && subItem.counter > 0}
                            <SidebarMenuBadge class="font-medium text-red-500">
                                {subItem.counter}
                            </SidebarMenuBadge>
                        {/if}
                    </Link>
                </SidebarMenuItem>
            {/each}
        </SidebarMenu>
    {/each}
</SidebarGroup>
