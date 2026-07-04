<script lang="ts">
    import AppSidebarLayout from '@/layouts/app/AppSidebarLayout.svelte';
    import AdminSidebar from '@/components/AdminSidebar.svelte';
    import UserSidebar from '@/components/UserSidebar.svelte';
    import type { BreadcrumbItemType } from '@/types';
    import type { Snippet } from 'svelte';
    import { page } from '@inertiajs/svelte';
    import { Toaster } from 'svelte-sonner';

    interface Props {
        breadcrumbs?: BreadcrumbItemType[];
        children?: Snippet;
    }

    let { breadcrumbs = [], children }: Props = $props();

    // you can use this or import isAdmin from '@/lib/isAdmin.svelte.js';
    let isAdmin = $derived($page.url.startsWith('/admin'));
</script>

<AppSidebarLayout {breadcrumbs} notifications={$page.props.notifications}>
    {#snippet sidebar()}
        {#if isAdmin}
            <AdminSidebar />
        {:else}
            <UserSidebar />
        {/if}
    {/snippet}
    {@render children?.()}
</AppSidebarLayout>

<Toaster richColors position="bottom-right" />
