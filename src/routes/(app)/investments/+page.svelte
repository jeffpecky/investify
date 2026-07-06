<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Search, TrendingUp, CircleDollarSign, CheckCircle, Clock, Plus } from 'lucide-svelte';
    import { formatDateExt, formatCurrency } from '$lib/utils';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let searchQuery = $state('');

    let total = $derived(data.investments.length);
    let active = $derived(data.investments.filter((d) => d.status === 'approved' || d.status === 'active').length);
    let pending = $derived(data.investments.filter((d) => d.status === 'pending').length);
    let totalInvested = $derived(data.investments.reduce((sum, inv) => sum + Number(inv.amount), 0));
    let totalProfit = $derived(data.investments.reduce((sum, inv) => sum + Number(inv.profitAccrued || 0), 0));

    let filteredInvestments = $derived(
        data.investments.filter((inv) => {
            const lowerQuery = searchQuery.toLowerCase();
            return (
                inv.status.toLowerCase().includes(lowerQuery) ||
                inv.id.toLowerCase().includes(lowerQuery) ||
                inv.planName.toLowerCase().includes(lowerQuery)
            );
        }),
    );

    function getProgressPercent(investment: any) {
        if (!investment.startDate || !investment.endDate) return 0;
        const start = new Date(investment.startDate).getTime();
        const end = new Date(investment.endDate).getTime();
        const now = Date.now();
        if (now >= end) return 100;
        if (now <= start) return 0;
        return Math.min(100, Math.round(((now - start) / (end - start)) * 100));
    }

    function getNextPaymentText(investment: any) {
        if (!investment.nextPaymentDate) return 'N/A';
        const next = new Date(investment.nextPaymentDate);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (next.toDateString() === today.toDateString()) return 'Today';
        if (next.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return formatDateExt(investment.nextPaymentDate);
    }
</script>

<svelte:head>
    <title>My Investments | Ethercore</title>
</svelte:head>

<div class="mx-auto w-full max-w-[1440px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
            <h2 class="text-3xl font-bold tracking-tight text-primary">My Investments</h2>
            <p class="mt-1 text-base text-muted-foreground">Manage and view your investment performance.</p>
        </div>
        <a href="/explore-plans">
            <Button class="h-12 gap-2 rounded-xl px-6 font-bold shadow-sm">
                <Plus class="h-5 w-5" />
                New Investment
            </Button>
        </a>
    </div>

    <!-- Stats Bar (Bento Grid Style) -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Invested -->
        <div class="rounded-xl border border-border/60 bg-card p-4">
            <div class="mb-2 flex items-center justify-between">
                <span class="text-sm font-bold text-muted-foreground">Total Invested</span>
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-primary">
                    <CircleDollarSign class="h-4 w-4" />
                </div>
            </div>
            <div class="text-xl font-bold tracking-tight text-foreground">{formatCurrency(totalInvested)}</div>
            <div class="mt-1 flex items-center gap-1">
                <span class="flex items-center text-xs font-bold text-success">
                    <TrendingUp class="mr-0.5 h-3.5 w-3.5" /> {total} total
                </span>
            </div>
        </div>

        <!-- Profit Accrued -->
        <div class="rounded-xl border border-border/60 bg-card p-4">
            <div class="mb-2 flex items-center justify-between">
                <span class="text-sm font-bold text-muted-foreground">Profit Accrued</span>
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-success/5 text-success">
                    <CircleDollarSign class="h-4 w-4" />
                </div>
            </div>
            <div class="text-xl font-bold tracking-tight text-success">{formatCurrency(totalProfit)}</div>
            <div class="mt-1 flex items-center gap-1">
                <span class="text-xs font-bold text-success">
                    {totalInvested > 0 ? Math.round((totalProfit / totalInvested) * 100) : 0}% Yield
                </span>
                <span class="text-xs text-muted-foreground">ROI since inception</span>
            </div>
        </div>

        <!-- Active Plans -->
        <div class="rounded-xl border border-border/60 bg-card p-4">
            <div class="mb-2 flex items-center justify-between">
                <span class="text-sm font-bold text-muted-foreground">Active Plans</span>
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <CheckCircle class="h-4 w-4" />
                </div>
            </div>
            <div class="text-xl font-bold tracking-tight text-foreground">{active}</div>
            <div class="mt-1">
                <span class="text-xs text-muted-foreground">Diversified across {active} {active === 1 ? 'plan' : 'plans'}</span>
            </div>
        </div>

        <!-- Pending Approvals -->
        <div class="rounded-xl border border-border/60 bg-card p-4">
            <div class="mb-2 flex items-center justify-between">
                <span class="text-sm font-bold text-muted-foreground">Pending Approvals</span>
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10 text-warning">
                    <Clock class="h-4 w-4" />
                </div>
            </div>
            <div class="text-xl font-bold tracking-tight text-foreground">{pending}</div>
            <div class="mt-1">
                <span class="text-xs text-muted-foreground">{pending === 0 ? 'No pending transactions' : `${pending} awaiting verification`}</span>
            </div>
        </div>
    </div>

    <!-- List Filter and View -->
    <div class="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <!-- Header -->
        <div class="flex flex-col gap-4 border-b border-border/60 bg-background p-4 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-3">
                <span class="text-lg font-bold text-foreground">Active Investments</span>
                <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{total} Total</span>
            </div>
            <div class="flex w-full items-center gap-3 md:w-auto">
                <div class="relative flex-1 md:w-64">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search plans..."
                        bind:value={searchQuery}
                        class="w-full rounded-lg border border-border/60 bg-background py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>
        </div>

        <!-- Investment Cards Container -->
        <div class="space-y-4 p-4">
            {#each filteredInvestments as investment (investment.id)}
                <div class="group relative overflow-hidden rounded-xl border border-border/60 bg-white p-6 transition-all hover:border-primary/30">
                    <!-- Background Accent -->
                    <div class="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-primary/5 transition-colors group-hover:bg-primary/10 -mr-16 -mt-16"></div>
                    
                    <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start">
                        <!-- Icon & Title Section -->
                        <div class="flex flex-1 gap-4">
                            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary transition-transform group-hover:scale-110">
                                <TrendingUp class="h-7 w-7" />
                            </div>
                            <div class="flex-1">
                                <div class="mb-1 flex items-center gap-2">
                                    <h3 class="text-lg font-bold text-foreground">{investment.planName}</h3>
                                    <span class="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-success">
                                        <span class="h-1.5 w-1.5 rounded-full bg-success animate-pulse"></span>
                                        {investment.status}
                                    </span>
                                </div>
                                <p class="mb-4 font-mono text-xs tracking-tight text-muted-foreground">ID: {investment.id}</p>
                                <div class="grid max-w-md grid-cols-2 gap-6">
                                    <div>
                                        <p class="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Invested</p>
                                        <p class="text-2xl font-bold text-primary">{formatCurrency(investment.amount)}</p>
                                    </div>
                                    <div>
                                        <p class="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Profit Accrued</p>
                                        <p class="text-2xl font-bold text-success">{formatCurrency(investment.profitAccrued)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Details & Action Section -->
                        <div class="flex min-w-[280px] flex-col items-end gap-4">
                            <div class="w-full space-y-2 rounded-xl bg-muted/50 p-4">
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-muted-foreground">Start Date</span>
                                    <span class="font-bold text-foreground">{formatDateExt(investment.startDate)}</span>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-muted-foreground">End Date</span>
                                    <span class="font-bold text-foreground">{formatDateExt(investment.endDate)}</span>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-muted-foreground">Next Payment</span>
                                    <span class="font-bold text-primary">{getNextPaymentText(investment)}</span>
                                </div>
                                <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                    <div class="h-full rounded-full bg-primary" style="width: {getProgressPercent(investment)}%"></div>
                                </div>
                            </div>
                            <div class="flex w-full gap-2">
                                <a href="/investments/{investment.id}" class="flex-1">
                                    <Button variant="outline" class="w-full">
                                        View Details
                                    </Button>
                                </a>
                                <a href="/investments/{investment.id}" class="flex-1">
                                    <Button class="w-full shadow-sm">
                                        Manage Plan
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <!-- Empty State -->
                <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 py-12 text-center">
                    <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                        <TrendingUp class="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h4 class="mb-1 text-lg font-bold text-foreground">Explore more opportunities</h4>
                    <p class="mb-4 max-w-sm text-sm text-muted-foreground">Diversify your portfolio with institutional-grade crypto investment strategies.</p>
                    <a href="/explore-plans">
                        <Button class="gap-2">
                            <Plus class="h-4 w-4" />
                            Explore Plans
                        </Button>
                    </a>
                </div>
            {/each}
        </div>

        <!-- Footer Pagination -->
        <div class="flex items-center justify-between border-t border-border/60 bg-background p-4">
            <p class="text-xs text-muted-foreground">Showing {filteredInvestments.length} of {total} active investment plans</p>
            <div class="flex gap-1">
                <button class="flex h-8 w-8 items-center justify-center rounded border border-border/60 text-muted-foreground hover:bg-muted disabled:opacity-30" disabled>
                    ‹
                </button>
                <button class="flex h-8 w-8 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">1</button>
                <button class="flex h-8 w-8 items-center justify-center rounded border border-border/60 text-muted-foreground hover:bg-muted">
                    ›
                </button>
            </div>
        </div>
    </div>
</div>
