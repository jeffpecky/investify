<script lang="ts">
    import { Search, TrendingUp } from 'lucide-svelte';
    import { Button } from '$lib/components/ui/button';
    import { formatCurrency } from '$lib/utils';
    import CalculatorModal from '$lib/components/user/CalculatorModal.svelte';
    import BuyPlanModal from '$lib/components/user/BuyPlanModal.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let searchQuery = $state('');

    const filteredPlans = $derived(
        data.plans.filter(
            (plan) => plan.name.toLowerCase().includes(searchQuery.toLowerCase()) || plan.category.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );

    function getCategoryBadgeClass(category: string) {
        const cat = category.toLowerCase();
        if (cat.includes('business')) return 'bg-primary/10 text-primary';
        if (cat.includes('reserved') || cat.includes('premium')) return 'bg-warning/10 text-warning';
        if (cat.includes('committee')) return 'bg-info/10 text-info';
        if (cat.includes('anniversary')) return 'bg-success/10 text-success';
        return 'bg-muted text-muted-foreground';
    }

    function getCategoryIcon(category: string) {
        const cat = category.toLowerCase();
        if (cat.includes('business')) return '💼';
        if (cat.includes('reserved') || cat.includes('premium')) return '🔒';
        if (cat.includes('committee')) return '👥';
        if (cat.includes('anniversary')) return '🎉';
        if (cat.includes('property') || cat.includes('real')) return '🏠';
        if (cat.includes('rare') || cat.includes('diamond')) return '💎';
        return '📈';
    }
</script>

<svelte:head>
    <title>Explore Portfolios | Ethercore</title>
</svelte:head>

<div class="mx-auto w-full max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2 text-success font-bold">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span class="text-xs font-bold tracking-widest uppercase">Investment Opportunities</span>
        </div>
        <h2 class="text-3xl font-bold tracking-tight">Explore Portfolios</h2>
        <p class="text-muted-foreground max-w-2xl">Discover and invest in curated, high-yield wealth management strategies designed for institutional-grade stability and growth.</p>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex items-center gap-3">
        <div class="relative flex-1 max-w-md group">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
                type="text"
                placeholder="Search investment assets..."
                bind:value={searchQuery}
                class="w-full bg-muted/50 border border-border/60 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none"
            />
        </div>
        <CalculatorModal plans={data.plans} />
    </div>

    <!-- Plan Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {#each filteredPlans as plan (plan.id)}
            <div class="bg-card rounded-2xl p-6 border border-border/60 hover:border-primary/50 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-xl">
                <div class="flex justify-between items-start mb-5">
                    <span class="px-3 py-1 {getCategoryBadgeClass(plan.category)} text-[10px] font-bold rounded-full uppercase tracking-tight">
                        {plan.category}
                    </span>
                    <div class="p-2 rounded-lg bg-muted/50 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <span class="text-lg">{getCategoryIcon(plan.category)}</span>
                    </div>
                </div>
                <h3 class="text-xl font-bold mb-3">{plan.name}</h3>
                <div class="flex items-center gap-2 text-success font-bold text-lg mb-4">
                    <TrendingUp class="h-5 w-5" />
                    <span class="text-2xl font-bold tabular-nums">
                        {plan.percentMin === plan.percentMax ? `${plan.percentMin}%` : `${plan.percentMin}%`}
                    </span>
                    <span class="text-xs font-bold opacity-70 uppercase">Returns</span>
                </div>
                <div class="bg-muted/40 rounded-xl p-4 mb-5">
                    <p class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Investment Range</p>
                    <p class="text-lg font-bold tabular-nums">
                        {formatCurrency(plan.minAmount)} - {formatCurrency(plan.maxAmount)}
                    </p>
                </div>
                <div class="flex flex-col gap-2.5 mb-6 flex-1">
                    <p class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">What's Included</p>
                    {#each plan.features.slice(0, 3) as feature}
                        <div class="flex items-center gap-2.5">
                            <svg class="h-4 w-4 text-success shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            <span class="text-sm">{feature}</span>
                        </div>
                    {/each}
                </div>
                <div class="flex justify-between items-center py-4 border-t border-border/60 mb-5">
                    <div>
                        <p class="text-[10px] text-muted-foreground uppercase font-bold">Duration</p>
                        <p class="font-bold">{plan.durationDays} Days</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] text-muted-foreground uppercase font-bold">Payout</p>
                        <p class="font-bold">{Array.isArray(plan.payoutOptions) ? plan.payoutOptions.join(', ') : plan.payoutOptions}</p>
                    </div>
                </div>
                <div class="mt-auto">
                    <BuyPlanModal
                        data={plan}
                        class="w-full h-12 text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    />
                </div>
            </div>
        {:else}
            <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div class="rounded-full bg-muted/50 p-6 mb-6 ring-1 ring-border">
                    <Search class="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 class="text-xl font-bold tracking-tight">No plans found</h3>
                <p class="text-muted-foreground mt-2 max-w-[250px] mx-auto">We couldn't find any plans matching "{searchQuery}".</p>
                <Button variant="outline" onclick={() => (searchQuery = '')} class="mt-6 rounded-full px-6">Clear Search</Button>
            </div>
        {/each}
    </div>
</div>
