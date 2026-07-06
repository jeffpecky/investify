<script lang="ts">
    import { Search, Calendar, TrendingUp, Wallet, Clock, Layers, ListFilter, Users, CircleCheck } from 'lucide-svelte';
    import * as Card from '$lib/components/ui/card';
    import { Button, buttonVariants } from '$lib/components/ui/button';
    import { Badge } from '$lib/components/ui/badge';
    import * as Accordion from '$lib/components/ui/accordion';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { formatCurrency, formatNumber, timeAgo, cn } from '$lib/utils';
    import * as InputGroup from '$lib/components/ui/input-group/index.js';
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

    let selectedPlan = $state(null);
    let openModal = $state(false);
</script>

<svelte:head>
    <title>Plans</title>
</svelte:head>

<div class="space-y-4 px-4 py-4 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-foreground">Explore Portfolios</h1>
            <p class="text-muted-foreground mt-1 text-sm">Discover and invest in curated, high-yield wealth management strategies.</p>
        </div>
        <div class="flex items-center gap-3">
            <InputGroup.Root>
                <InputGroup.Input placeholder="Search..." bind:value={searchQuery} />
                <InputGroup.Addon>
                    <Search />
                </InputGroup.Addon>
                <InputGroup.Addon align="inline-end">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'size-6 hover:cursor-pointer')}>
                            <ListFilter class="size-4" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content align="end" class="w-48">
                            <DropdownMenu.Label>Filter by Category</DropdownMenu.Label>
                            <DropdownMenu.Item class="gap-2" onclick={() => (searchQuery = '')}>
                                <span>All</span>
                            </DropdownMenu.Item>

                            {#each [...new Set(data.plans.map((p) => p.category))] as category}
                                <DropdownMenu.Item class="gap-2" onclick={() => (searchQuery = category)}>
                                    <span>{category}</span>
                                </DropdownMenu.Item>
                            {/each}
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </InputGroup.Addon>
            </InputGroup.Root>
            <CalculatorModal plans={data.plans} />
        </div>
    </div>

    <!-- Grid Layout: 3 columns on desktop, 2 on tablet, 1 on mobile -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each filteredPlans as plan (plan.id)}
            <Card.Root
                class="group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl flex flex-col"
            >
                <div
                    class="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-primary/10 pointer-events-none"
                ></div>

                <Card.Content class="p-5 flex flex-col flex-1 relative z-10">
                    <!-- Header -->
                    <div class="mb-5">
                        <div class="flex items-start justify-between mb-3">
                            <Badge variant="outline" class="bg-primary/10 text-primary border-primary/30 px-3 py-1 font-medium">
                                {plan.category}
                            </Badge>
                            {#if plan.recommended}
                                <Badge variant="secondary" class="bg-primary/10 text-primary border-primary/20">
                                    <span class="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                                    Recommended
                                </Badge>
                            {/if}
                        </div>
                        <Card.Title class="text-2xl font-bold group-hover:text-primary transition-colors mb-2">
                            {plan.name}
                        </Card.Title>
                        <div class="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp class="h-4 w-4 text-primary" />
                            <span class="font-bold text-lg text-primary">
                                {plan.percentMin === plan.percentMax ? `${plan.percentMin}%` : `${plan.percentMin}% - ${plan.percentMax}%`}
                            </span>
                            <span>Returns</span>
                        </div>
                    </div>

                    <!-- Price Range -->
                    <div class="mb-5 p-3 rounded-lg bg-muted/40 border border-border">
                        <div class="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Investment Range</div>
                        <div class="text-xl font-bold tabular-nums">
                            {formatCurrency(plan.minAmount)} - {formatCurrency(plan.maxAmount)}
                        </div>
                    </div>

                    <!-- Features -->
                    <div class="mb-5 flex-1">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">What's Included?</h4>
                        <ul class="space-y-2">
                            {#each plan.features.slice(0, 4) as feature}
                                <li class="flex items-start gap-2 text-sm">
                                    <CircleCheck class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <span>{feature}</span>
                                </li>
                            {/each}
                        </ul>
                    </div>

                    <!-- Duration & Payout Info -->
                    <div class="mb-5 space-y-2 text-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">Duration</span>
                            <span class="font-semibold tabular-nums">{plan.durationDays} Days</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">Payout</span>
                            <span class="font-semibold">{Array.isArray(plan.payoutOptions) ? plan.payoutOptions.join(', ') : plan.payoutOptions}</span>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div class="mt-auto">
                        <BuyPlanModal
                            data={plan}
                            class="w-full h-11 text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                        />
                    </div>
                </Card.Content>
            </Card.Root>
        {:else}
            <div class="col-span-full flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-300">
                <div class="rounded-full bg-muted/50 p-6 mb-6 ring-1 ring-border shadow-inner">
                    <Search class="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 class="text-xl font-bold tracking-tight">No plans found</h3>
                <p class="text-muted-foreground mt-2 max-w-[250px] mx-auto">We couldn't find any plans matching "{searchQuery}".</p>
                <Button variant="outline" onclick={() => (searchQuery = '')} class="mt-6 rounded-full px-6">Clear Search</Button>
            </div>
        {/each}
    </div>
</div>
