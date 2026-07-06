<script lang="ts">
    import { SidebarProvider } from '$lib/components/ui/sidebar';
    import type { Snippet } from 'svelte';

    interface Props {
        variant?: 'header' | 'sidebar';
        class?: string;
        defaultOpen?: boolean;
        children?: Snippet;
    }

    let { variant = 'sidebar', class: className, defaultOpen = true, children }: Props = $props();

    let isOpen = $state(defaultOpen);
</script>

{#if variant === 'header'}
    <div class="flex min-h-screen w-full flex-col {className}">
        {@render children?.()}
    </div>
{:else}
    <SidebarProvider open={isOpen}>
        {@render children?.()}
    </SidebarProvider>
{/if}
