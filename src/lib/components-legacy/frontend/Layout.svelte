<script>
    import Header from './Header.svelte';
    import Footer from './Footer.svelte';
    import CookieConsent from './CookieConsent.svelte';
    import { Toaster } from 'svelte-sonner';

    let { children, header, footer } = $props();
</script>

<div class="flex min-h-screen flex-col font-display antialiased">
    {#if header}
        {@render header()}
    {:else}
        <Header />
    {/if}

    <main class="flex-1">
        {@render children?.()}
    </main>

    {#if footer}
        {@render footer()}
    {:else}
        <Footer />
    {/if}
</div>

<CookieConsent />
<Toaster richColors position="bottom-right" />
