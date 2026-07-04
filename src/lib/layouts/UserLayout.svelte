<script lang="ts">
    import AppContent from '@/components/AppContent.svelte';
    import AppShell from '@/components/AppShell.svelte';
    import AppLogo from '@/components/AppLogo.svelte';
    import Breadcrumbs from '@/components/Breadcrumbs.svelte';
    import { getInitials } from '@/hooks/useInitials';
    import { isAdmin } from '@/lib/isAdmin.svelte.js';
    import type { BreadcrumbItemType, Notification } from '@/types';
    import type { Snippet } from 'svelte';
    import { Link, page } from '@inertiajs/svelte';
    import { Toaster } from 'svelte-sonner';
    import { SYSTEM } from '@/lib/store';
    import Header from '@/components/Header.svelte';
    import Footer from '@/components/Footer.svelte';

    interface Props {
        breadcrumbs?: BreadcrumbItemType[];
        children?: Snippet;
    }

    let { breadcrumbs = [], children }: Props = $props();

    let showAlert = $state(false);
    let showPromo = $state(false);
    let showSurvey = $state(false);

    let takeover = true;

    function handlePromoClick() {
        showPromo = false;
    }
</script>

<AppShell variant="header">
    <!-- Top Navigation Bar -->
    <div>
        <Header />

        <!-- Breadcrumbs -->
        {#if breadcrumbs.length > 1}
            <div class="flex w-full border-b border-sidebar-border/70">
                <div class="mx-auto flex h-10 w-full items-center justify-start px-4 text-muted-foreground sm:px-6 lg:px-8">
                    <Breadcrumbs {breadcrumbs} />
                </div>
            </div>
        {/if}
    </div>

    <!-- Content -->
    <AppContent variant="header">
        <div class="flex flex-col min-h-screen">
            <div class="flex-1">
                {@render children?.()}
            </div>
            <Footer />
        </div>
    </AppContent>
</AppShell>

{#if showAlert}
    <AlertDialog position="top-left" title="KYC Update Required" message="Please update your KYC information to continue using our services.">
        {#snippet component()}
            <KYCModal />
        {/snippet}
    </AlertDialog>
{/if}
{#if showSurvey}
    <AlertDialog
        position="top-right"
        link=""
        title="You have a survey to complete"
        message="<p>Please complete the following surveys.</p> </br> 
        <ol>
            <li>1. <a class='underline text-primary' href='/user/survey/1'>Best investment plan</a></li>
            <li>2. <a class='underline text-primary' href='/user/survey/2'>Another survey</a></li>
            <li>3. <a class='underline text-primary' href='/user/survey/3'>Final survey</a></li>
        </ol>
        "
    />
{/if}

{#if showPromo}
    <PromotionalModal
        open={showPromo}
        title={`Get £1,000,000 in ${$SYSTEM.siteName} Now!!!`}
        body="Chop free 1 billion pounds now!!!"
        image="https://images.unsplash.com/photo-1517232117795-40c9d8212a04?q=80&w=2346&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        onClose={handlePromoClick}
    />
{/if}

{#if takeover && !$isAdmin}
    <div class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 pointer-events-none">
        <p
            class="animate-pulse rounded-full border border-red-500 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-500 shadow-lg backdrop-blur-md"
        >
            Takeover Mode Active
        </p>
    </div>
{/if}

<Toaster richColors position="bottom-right" />
