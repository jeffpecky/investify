<script lang="ts">
    import { Wallet, TrendingUp, Users, RefreshCw, PieChart, ArrowRightLeft, Clock, CheckCircle, ArrowUp, Building2, WalletCards, BarChart3 } from 'lucide-svelte';
    import Chart from '$lib/components/user/Chart.svelte';
    import { formatCurrency, formatNumber } from '$lib/utils';
    import { Button } from '$lib/components/ui/button';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    // Generate sparkline SVG points from historical data
    function generateSparklineFromData(data: number[]) {
        if (!data || data.length === 0) return '';
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const points = [];
        for (let i = 0; i < 8; i++) {
            const dataIndex = Math.min(Math.floor((i / 7) * (data.length - 1)), data.length - 1);
            const value = data[dataIndex];
            const x = i * 8;
            const y = 32 - ((value - min) / range * 28 + 2);
            points.push(`${x},${y}`);
        }
        return points.join(' ');
    }

    function getSparklineColor(data: number[]) {
        if (!data || data.length < 2) return 'oklch(0.55 0.025 264)';
        return data[data.length - 1] >= data[0] ? 'oklch(0.596 0.145 163)' : 'oklch(0.577 0.245 27)';
    }

    // Calculate time ago
    function timeAgo(date: Date | string | null) {
        if (!date) return 'N/A';
        const now = new Date();
        const past = new Date(date);
        const diffMs = now.getTime() - past.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
    }

    // Activity icon config by type
    function getActivityIcon(type: string) {
        switch (type) {
            case 'investment': return { icon: Building2, bg: 'bg-primary/10', text: 'text-primary' };
            case 'withdrawal': return { icon: ArrowUp, bg: 'bg-info/10', text: 'text-info' };
            case 'payout': return { icon: CheckCircle, bg: 'bg-success/10', text: 'text-success' };
            default: return { icon: RefreshCw, bg: 'bg-muted', text: 'text-muted-foreground' };
        }
    }

    function getActivityTitle(type: string) {
        switch (type) {
            case 'investment': return 'New Investment';
            case 'withdrawal': return 'Withdrawal Request';
            case 'payout': return 'Profit Distribution';
            default: return 'Transaction';
        }
    }

    function getActivityAmountClass(type: string, amount: number) {
        if (type === 'payout') return 'text-success';
        if (type === 'withdrawal') return 'text-foreground';
        return 'text-foreground';
    }

    // Portfolio colors
    const portfolioColors = [
        { bg: 'bg-primary', stroke: 'oklch(0.398 0.127 264)' },
        { bg: 'bg-info', stroke: 'oklch(0.63 0.14 240)' },
        { bg: 'bg-success', stroke: 'oklch(0.596 0.145 163)' },
        { bg: 'bg-warning', stroke: 'oklch(0.768 0.165 75)' },
        { bg: 'bg-destructive', stroke: 'oklch(0.577 0.245 27)' },
        { bg: 'bg-muted-foreground', stroke: 'oklch(0.55 0.025 264)' }
    ];

    // Calculate donut chart segments
    function calculateDonutSegments() {
        if (!data.portfolioDistribution || data.portfolioDistribution.length === 0) return [];
        let offset = 0;
        return data.portfolioDistribution.map((item, index) => {
            const percentage = parseFloat(item.percentage);
            const segment = {
                ...item,
                dashArray: `${percentage} ${100 - percentage}`,
                dashOffset: -offset,
                color: portfolioColors[index % portfolioColors.length]
            };
            offset += percentage;
            return segment;
        });
    }

    const donutSegments = $derived(calculateDonutSegments());

    // Stat card configs
    const statCards = $derived([
        {
            label: 'Total Invested',
            value: formatCurrency(data.stats.totalInvested),
            icon: TrendingUp,
            iconBg: 'bg-primary/10',
            iconColor: 'text-primary',
            badge: data.historical?.changes?.invested?.percent !== undefined
                ? `${data.historical.changes.invested.percent >= 0 ? '+' : ''}${data.historical.changes.invested.percent.toFixed(1)}%`
                : null,
            badgePositive: (data.historical?.changes?.invested?.percent || 0) >= 0,
            sparkline: data.historical?.sparklineData?.invested || []
        },
        {
            label: 'Available Balance',
            value: formatCurrency(data.stats.walletBalance),
            icon: WalletCards,
            iconBg: 'bg-info/10',
            iconColor: 'text-info',
            badge: 'USD Tether',
            badgeNeutral: true,
            sparkline: data.historical?.sparklineData?.balance || []
        },
        {
            label: 'Total Earnings',
            value: formatCurrency(data.stats.totalProfit),
            icon: BarChart3,
            iconBg: 'bg-success/10',
            iconColor: 'text-success',
            badge: data.historical?.changes?.profit?.percent !== undefined
                ? `${data.historical.changes.profit.percent >= 0 ? '+' : ''}${data.historical.changes.profit.percent.toFixed(1)}%`
                : null,
            badgePositive: (data.historical?.changes?.profit?.percent || 0) >= 0,
            sparkline: data.historical?.sparklineData?.profit || []
        },
        {
            label: 'Referral Earnings',
            value: formatCurrency(data.stats.referralEarnings),
            icon: Users,
            iconBg: 'bg-warning/10',
            iconColor: 'text-warning',
            badge: data.portfolioDistribution?.length ? `${data.portfolioDistribution.length} Partners` : null,
            badgeNeutral: true,
            sparkline: data.historical?.sparklineData?.referral || []
        }
    ]);
</script>

<svelte:head>
    <title>Dashboard | Ethercore</title>
</svelte:head>

<div class="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Top Row: 4 Stat Cards -->
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {#each statCards as card}
            <div class="glass-card p-5 rounded-xl flex flex-col gap-2">
                <div class="flex items-center justify-between mb-1">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg {card.iconBg}">
                        <card.icon class="h-5 w-5 {card.iconColor}" />
                    </div>
                    {#if card.badge}
                        {#if card.badgeNeutral}
                            <span class="text-xs font-medium text-muted-foreground">{card.badge}</span>
                        {:else}
                            <span class="text-xs font-semibold px-2 py-0.5 rounded {card.badgePositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}">
                                {card.badge}
                            </span>
                        {/if}
                    {/if}
                </div>
                <p class="text-xs font-semibold text-muted-foreground tracking-wide uppercase">{card.label}</p>
                <div class="flex items-end justify-between">
                    <h2 class="text-2xl font-bold tracking-tight tabular-nums">{card.value}</h2>
                    {#if card.sparkline && card.sparkline.length > 0}
                        <svg class="h-8 w-16 opacity-40" viewBox="0 0 64 32" preserveAspectRatio="none">
                            <polyline
                                points={generateSparklineFromData(card.sparkline)}
                                fill="none"
                                stroke={getSparklineColor(card.sparkline)}
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    {/if}
                </div>
            </div>
        {/each}
    </div>

    <!-- Middle Row: Chart + Recent Activity -->
    <div class="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <!-- Chart (2/3 width) -->
        <div class="lg:col-span-2">
            <Chart />
        </div>

        <!-- Recent Activity (1/3 width) -->
        <div class="glass-card p-5 rounded-xl flex flex-col">
            <div class="flex items-center justify-between mb-5">
                <h3 class="text-base font-semibold">Recent Activity</h3>
                <a href="/investments" class="text-xs font-semibold text-primary hover:underline">View All</a>
            </div>
            <div class="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-1">
                {#if data.recentActivity && data.recentActivity.length > 0}
                    {#each data.recentActivity as activity}
                        {@const iconConfig = getActivityIcon(activity.type)}
                        <div class="flex gap-3">
                            <div class="h-10 w-10 shrink-0 rounded-full {iconConfig.bg} flex items-center justify-center {iconConfig.text}">
                                <iconConfig.icon class="h-5 w-5" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-start gap-2">
                                    <p class="text-sm font-semibold truncate">{getActivityTitle(activity.type)}</p>
                                    <p class="text-sm font-bold tabular-nums whitespace-nowrap {getActivityAmountClass(activity.type, parseFloat(activity.amount))}">
                                        {activity.type === 'withdrawal' ? '-' : '+'}{formatCurrency(parseFloat(activity.amount))}
                                    </p>
                                </div>
                                <p class="text-xs text-muted-foreground mt-0.5">{activity.planName} · {timeAgo(activity.createdAt)}</p>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <div class="py-10 text-center">
                        <Clock class="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                        <p class="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <!-- Bottom Row: Portfolio + Quick Action + Active Plans -->
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <!-- Portfolio Allocation -->
        <div class="glass-card p-5 rounded-xl">
            <div class="flex items-center justify-between mb-5">
                <h3 class="text-base font-semibold">Portfolio</h3>
                <span class="text-xs font-medium text-muted-foreground">{data.portfolioDistribution?.length || 0} Assets</span>
            </div>

            {#if data.portfolioDistribution && data.portfolioDistribution.length > 0}
                <div class="flex items-center gap-6">
                    <!-- Donut Chart -->
                    <div class="relative h-32 w-32 shrink-0">
                        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="oklch(0.955 0.008 264)" stroke-width="4" />
                            {#each donutSegments as segment}
                                <circle
                                    cx="18" cy="18" r="16" fill="none"
                                    stroke={segment.color.stroke}
                                    stroke-width="4"
                                    stroke-dasharray={segment.dashArray}
                                    stroke-dashoffset={segment.dashOffset}
                                    stroke-linecap="round"
                                />
                            {/each}
                        </svg>
                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Diversified</span>
                            <span class="text-lg font-bold">100%</span>
                        </div>
                    </div>
                    <!-- Legend -->
                    <div class="flex-1 space-y-2.5">
                        {#each data.portfolioDistribution.slice(0, 4) as item, index}
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <div class="h-2.5 w-2.5 rounded-full {portfolioColors[index % portfolioColors.length].bg}"></div>
                                    <span class="text-xs font-medium truncate max-w-[120px]">{item.planName}</span>
                                </div>
                                <span class="text-xs font-bold tabular-nums">{item.percentage}%</span>
                            </div>
                        {/each}
                    </div>
                </div>
            {:else}
                <div class="py-10 text-center">
                    <PieChart class="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                    <p class="text-sm text-muted-foreground">No portfolio data</p>
                </div>
            {/if}
        </div>

        <!-- Quick Action -->
        <div class="glass-card p-5 rounded-xl flex flex-col">
            <h3 class="text-base font-semibold mb-4">Quick Action</h3>
            <div class="space-y-3 flex-1">
                <!-- From Card -->
                <div class="bg-muted/50 border border-border/60 rounded-xl p-3.5">
                    <div class="flex justify-between text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                        <span>From</span>
                        <span class="flex items-center gap-1 text-primary">
                            <Wallet class="h-3 w-3" /> Balance
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-xl font-bold tabular-nums">{formatCurrency(data.stats.walletBalance)}</span>
                        <span class="text-sm font-medium text-muted-foreground">USDT</span>
                    </div>
                </div>

                <!-- Swap Button -->
                <div class="flex justify-center -my-1.5 relative z-10">
                    <div class="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                        <ArrowRightLeft class="h-4 w-4" />
                    </div>
                </div>

                <!-- To Card -->
                <div class="bg-muted/50 border border-border/60 rounded-xl p-3.5">
                    <div class="flex justify-between text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                        <span>To</span>
                        <span class="flex items-center gap-1 text-primary">
                            <TrendingUp class="h-3 w-3" /> Investment
                        </span>
                    </div>
                    <div class="flex justify-between items-center cursor-pointer hover:opacity-70 transition-opacity">
                        <span class="text-sm font-medium text-muted-foreground">Select Plan</span>
                        <svg class="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>

                <!-- Browse Plans Button -->
                <a href="/plans" class="block w-full mt-2">
                    <Button class="w-full h-11 rounded-lg font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all shadow-sm">
                        Browse Plans
                    </Button>
                </a>
            </div>
        </div>

        <!-- Active Plans -->
        <div class="glass-card p-5 rounded-xl">
            <div class="flex items-center justify-between mb-5">
                <h3 class="text-base font-semibold">Active Plans</h3>
                <a href="/investments" class="text-xs font-semibold text-primary hover:underline">View All</a>
            </div>
            <div class="space-y-3">
                {#if data.activePlans && data.activePlans.length > 0}
                    {#each data.activePlans as plan}
                        <div class="p-4 border border-border/60 rounded-xl hover:bg-muted/30 transition-colors group cursor-pointer">
                            <div class="flex justify-between items-start mb-2.5">
                                <div>
                                    <p class="text-sm font-bold">{plan.name}</p>
                                    <p class="text-[11px] text-muted-foreground">{plan.investmentCount} investment{plan.investmentCount !== 1 ? 's' : ''} active</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-bold tabular-nums">{formatCurrency(parseFloat(plan.investedAmount))}</p>
                                    <p class="text-[11px] font-bold text-success tabular-nums">
                                        {plan.percentMin === plan.percentMax ? `${plan.percentMin}%` : `${plan.percentMin}-${plan.percentMax}%`} APR
                                    </p>
                                </div>
                            </div>
                            <div class="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div class="h-full bg-primary rounded-full group-hover:opacity-80 transition-all" style="width: {Math.min((parseFloat(plan.investedAmount) / (data.stats.totalInvested || 1)) * 100 * 2, 100)}%"></div>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <div class="py-10 text-center">
                        <BarChart3 class="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                        <p class="text-sm text-muted-foreground">No active investments</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="pt-6 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-4 py-6">
        <div class="flex flex-col md:flex-row items-center gap-6">
            <p class="text-sm text-muted-foreground">&copy; 2024 Ethercore Asset Management. All rights reserved.</p>
            <div class="flex gap-4">
                <span class="text-sm text-muted-foreground">Privacy Policy</span>
                <span class="text-sm text-muted-foreground">Terms of Service</span>
                <span class="text-sm text-muted-foreground">Cookie Policy</span>
            </div>
        </div>
    </footer>
</div>
