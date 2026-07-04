<script lang="ts">
    import { page, router } from '@inertiajs/svelte';
    let { children } = $props();

    let currenPage = $derived($page.url);
</script>

<div class="flex items-center gap-1 rounded-lg bg-muted p-1 mb-4 w-fit">
    <button
        class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer {currenPage === '/admin/settings/plan/categories'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}"
        onclick={() => router.visit('/admin/settings/plan/categories')}
    >
        Categories
    </button>
    <button
        class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer {currenPage === '/admin/settings/plan/features'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}"
        onclick={() => router.visit('/admin/settings/plan/features')}
    >
        Features
    </button>
    <button
        class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer {currenPage === '/admin/settings/plan/payout-options'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}"
        onclick={() => router.visit('/admin/settings/plan/payout-options')}
    >
        Payout Options
    </button>
    <button
        class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer {currenPage === '/admin/settings/plan/holidays'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}"
        onclick={() => router.visit('/admin/settings/plan/holidays')}
    >
        Holidays
    </button>
</div>

{@render children?.()}
