<script lang="ts">
    import UserSidebar from '$lib/components/UserSidebar.svelte';
    import { SidebarProvider, SidebarInset, SidebarTrigger } from '$lib/components/ui/sidebar';
    import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
    import type { BreadcrumbItemType } from '$lib/types';
    import { Toaster } from 'svelte-sonner';
    import Footer from '$lib/components/Footer.svelte';
    import { Search, Bell, HelpCircle } from 'lucide-svelte';
    import { Button } from '$lib/components/ui/button';
    import type { LayoutData } from './$types';

    let { data, children }: { data: LayoutData; children?: any } = $props();

    let breadcrumbs: BreadcrumbItemType[] = $state([]);
</script>

<SidebarProvider defaultOpen={true}>
    <UserSidebar />
    <SidebarInset>
        <header class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-5">
            <div class="flex flex-1 items-center gap-3">
                <SidebarTrigger class="-ml-1 lg:hidden" />
                <div class="relative w-full max-w-sm group">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search markets, assets, or plans..."
                        class="w-full bg-muted/50 border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                </div>
            </div>
            <div class="flex items-center gap-1.5">
                <Button variant="ghost" size="icon" class="relative h-9 w-9 rounded-full">
                    <Bell class="h-4 w-4 text-muted-foreground" />
                    <span class="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full border-2 border-background"></span>
                </Button>
                <Button variant="ghost" size="icon" class="h-9 w-9 rounded-full">
                    <HelpCircle class="h-4 w-4 text-muted-foreground" />
                </Button>
                <div class="h-6 w-px bg-border mx-1"></div>
                <Button class="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm hover:opacity-90 transition-opacity h-9">
                    Trade Now
                </Button>
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
