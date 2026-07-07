<script lang="ts">
    import { Search, TrendingUp, Check, ArrowRight } from 'lucide-svelte';
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
</script>

<svelte:head>
    <title>Explore Portfolios | Ethercore</title>
</svelte:head>

<div class="mx-auto w-full max-w-[1440px] space-y-4 px-4 py-4 sm:px-5 lg:px-6">
    <!-- Page Header -->
    <div class="flex flex-col gap-1">
        <h2 class="text-2xl font-bold tracking-tight">Explore Portfolios</h2>
        <p class="text-sm text-muted-foreground max-w-2xl">Discover and invest in curated, high-yield wealth management strategies designed for institutional-grade stability and growth.</p>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex items-center gap-3">
        <div class="relative flex-1 max-w-sm group">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
                type="text"
                placeholder="Search investment assets..."
                bind:value={searchQuery}
                class="w-full bg-muted/50 border border-border/60 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none"
            />
        </div>
        <CalculatorModal plans={data.plans} />
    </div>

    <!-- Plan Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
        {#each filteredPlans as plan (plan.id)}
            <div class="bg-card rounded-xl border border-border/60 p-4 flex flex-col">
                <div class="flex items-center justify-between mb-3">
                    <span class="px-2 py-0.5 {getCategoryBadgeClass(plan.category)} text-[10px] font-bold rounded uppercase tracking-wider">
                        {plan.category}
                    </span>
                </div>
                <h3 class="text-base font-bold mb-2">{plan.name}</h3>
                <div class="flex items-center gap-1.5 text-success mb-3">
                    <TrendingUp class="h-4 w-4" />
                    <span class="text-xl font-bold tabular-nums">
                        {plan.percentMin === plan.percentMax ? `${plan.percentMin}%` : `${plan.percentMin}%`}
                    </span>
                    <span class="text-[10px] font-bold opacity-70 uppercase">Returns</span>
                </div>
                <div class="bg-muted/50 rounded-lg p-3 mb-3">
                    <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Investment Range</p>
                    <p class="text-sm font-bold tabular-nums">
                        {formatCurrency(plan.minAmount)} - {formatCurrency(plan.maxAmount)}
                    </p>
                </div>
                <div class="flex flex-col gap-1.5 mb-4 flex-1">
                    <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">What's Included</p>
                    {#each plan.features.slice(0, 3) as feature}
                        <div class="flex items-center gap-2">
                            <Check class="h-3.5 w-3.5 text-success shrink-0" />
                            <span class="text-xs">{feature}</span>
                        </div>
                    {/each}
                </div>
                <div class="flex justify-between items-center py-3 border-t border-border/60 mb-3">
                    <div>
                        <p class="text-[10px] text-muted-foreground uppercase font-bold">Duration</p>
                        <p class="text-xs font-bold">{plan.durationDays} Days</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] text-muted-foreground uppercase font-bold">Payout</p>
                        <p class="text-xs font-bold">{Array.isArray(plan.payoutOptions) ? plan.payoutOptions.join(', ') : plan.payoutOptions}</p>
                    </div>
                </div>
                <div class="mt-auto">
                    <BuyPlanModal
                        data={plan}
                        class="w-full h-9 text-xs font-bold rounded-lg flex items-center justify-center gap-2"
                    />
                </div>
            </div>
        {:else}
            <div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div class="rounded-full bg-muted/50 p-4 mb-4">
                    <Search class="h-6 w-6 text-muted-foreground/50" />
                </div>
                <h3 class="text-base font-bold tracking-tight">No plans found</h3>
                <p class="text-xs text-muted-foreground mt-1 max-w-[250px]">We couldn't find any plans matching "{searchQuery}".</p>
                <Button variant="outline" onclick={() => (searchQuery = '')} class="mt-4 h-8 text-xs px-4 rounded-lg">Clear Search</Button>
            </div>
        {/each}
    </div>
</div>
