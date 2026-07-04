<script lang="ts">
    import Heading from '@/components/Heading.svelte';
    import { Button } from '@/components/ui/button';
    import { Separator } from '@/components/ui/separator';
    import { cn } from '@/lib/utils';
    import { type NavItemGroup } from '@/types';
    import { Link, page } from '@inertiajs/svelte';
    import type { Snippet } from 'svelte';

    import { SidebarGroupLabel } from '@/components/ui/sidebar';

    const sidebarNavItems: NavItemGroup[] = [
        {
            menuGroup: 'Personal',
            items: [
                {
                    title: 'Profile',
                    href: '/user/settings/profile',
                },
                {
                    title: 'Password',
                    href: '/user/settings/password',
                },
                {
                    title: 'Two-Factor',
                    href: '/user/settings/two-factor',
                },
                {
                    title: 'Appearance',
                    href: '/user/settings/appearance',
                },
            ],
        },
    ];

    const currentPath = $page.props.ziggy?.location ? new URL($page.props.ziggy.location).pathname : '';

    interface Props {
        children?: Snippet;
        size?: string;
    }

    let { children, size = 'max-w-xl' }: Props = $props();
</script>

<div class="px-4 py-6">
    <Heading title="Settings" description="Manage your profile and account settings" />

    <div class="flex flex-col lg:flex-row lg:space-x-12">
        <aside class="w-full max-w-xl lg:w-48">
            <nav class="flex flex-col space-x-0 space-y-1">
                {#each sidebarNavItems as item (item.menuGroup)}
                    <SidebarGroupLabel>{item.menuGroup}</SidebarGroupLabel>
                    {#each item.items as subItem (subItem.href)}
                        <Link href={subItem.href}>
                            <Button
                                variant="ghost"
                                class={cn('w-full justify-start', {
                                    'bg-muted': currentPath === subItem.href,
                                })}
                            >
                                {subItem.title}
                            </Button>
                        </Link>
                    {/each}
                {/each}
            </nav>
        </aside>

        <Separator class="my-6 lg:hidden" />

        <div class="flex-1 md:max-w-2xl">
            <section class="{size} space-y-12">
                {@render children?.()}
            </section>
        </div>
    </div>
</div>
