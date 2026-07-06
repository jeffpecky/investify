<script lang="ts">
    import UserSidebar from '$lib/components/UserSidebar.svelte';
    import { SidebarProvider, SidebarInset, SidebarTrigger } from '$lib/components/ui/sidebar';
    import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
    import type { BreadcrumbItemType } from '$lib/types';
    import { Toaster } from 'svelte-sonner';
    import Footer from '$lib/components/Footer.svelte';
    import type { LayoutData } from './$types';

    let { data, children }: { data: LayoutData; children?: any } = $props();

    let breadcrumbs: BreadcrumbItemType[] = $state([]);
</script>

<SidebarProvider defaultOpen={true}>
    <UserSidebar />
    <SidebarInset>
        <header class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b">
            <div class="flex flex-1 items-center gap-2 px-3">
                <SidebarTrigger class="-ml-1" />
                <div class="h-4 w-px bg-border mx-2"></div>
                {#if breadcrumbs.length > 1}
                    <Breadcrumbs {breadcrumbs} />
                {/if}
            </div>
        </header>

        <div class="flex flex-col min-h-[calc(100vh-3.5rem)]">
            <div class="flex-1">
                {@render children?.()}
            </div>
            <Footer />
        </div>
    </SidebarInset>
</SidebarProvider>

<Toaster richColors position="bottom-right" />
